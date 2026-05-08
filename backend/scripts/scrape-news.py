#!/usr/bin/env python3
"""
Scrape all news articles from fn-tech.com news page.
Uses curl to fetch pages (handles mixed encoding) and extracts article detail URLs,
then fetches each article's content.
"""

import json
import re
import subprocess
import sys
from pathlib import Path


def fetch_with_curl(url: str) -> bytes:
    """Fetch page using curl, return raw bytes."""
    result = subprocess.run(
        ['curl', '-s', '-L', '--compressed', url],
        capture_output=True,
        timeout=30,
    )
    return result.stdout


def decode_content(raw: bytes) -> str:
    """Decode content - the website uses GBK bytes that are valid UTF-8 sequences."""
    # The website serves content where Chinese characters are encoded as UTF-8 bytes
    # but some characters may fail GBK decoding. Try UTF-8 first.
    try:
        return raw.decode('utf-8')
    except UnicodeDecodeError:
        return raw.decode('gbk', errors='replace')


def extract_article_urls(html: str) -> list[str]:
    """Extract all news_more/*.html URLs from HTML."""
    urls = re.findall(r'href="([^"]*news_more/\d+\.html)"', html)
    return list(dict.fromkeys(urls))


def extract_pagination_urls(html: str) -> list[str]:
    """Extract pagination URLs."""
    urls = re.findall(r'href="([^"]*news\.html\?page=\d+[^"]*)"', html)
    return list(dict.fromkeys(urls))


def fetch_article_detail(url: str) -> dict | None:
    """Fetch a single article detail page and extract title, date, content."""
    raw = fetch_with_curl(url)
    if not raw:
        return None

    html = decode_content(raw)

    # Extract title from h1.artdetail_title
    title = ''
    h1_match = re.search(r'class="artdetail_title"[^>]*>([^<]+)</h1>', html)
    if h1_match:
        title = h1_match.group(1).strip()
    else:
        title_match = re.search(r'<title>([^<]+)</title>', html)
        if title_match:
            title = title_match.group(1).strip()

    # Extract publish date - look for 发布时间：YYYY-MM-DD
    date = ''
    date_match = re.search(r'发布时间[：:]\s*(\d{4}-\d{2}-\d{2})', html)
    if date_match:
        date = date_match.group(1)
    else:
        # Try format like 2025年3月10日
        date_match = re.search(r'(\d{4})[年/-](\d{1,2})[月/-](\d{1,2})[日]?', html)
        if date_match:
            year, month, day = date_match.groups()
            date = f'{year}-{month.zfill(2)}-{day.zfill(2)}'

    # Extract content from artview_content div
    content = ''
    content_match = re.search(
        r'class="artview_content"[^>]*>(.*?)</div>\s*</div>\s*</div>\s*</div>',
        html,
        re.DOTALL,
    )
    if not content_match:
        # Try alternative pattern
        content_match = re.search(
            r'class="artview_detail"[^>]*>(.*?)</div>',
            html,
            re.DOTALL,
        )

    if content_match:
        content_html = content_match.group(1)
        # Strip HTML tags
        content = re.sub(r'<script[^>]*>.*?</script>', '', content_html, flags=re.DOTALL)
        content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)
        content = re.sub(r'<[^>]+>', ' ', content)
        content = re.sub(r'\s+', ' ', content).strip()
        # Clean up &nbsp;
        content = content.replace('&nbsp;', ' ').strip()

    return {
        'title': title,
        'url': url,
        'date': date,
        'content': content[:5000] if content else '',
    }


def scrape_news():
    base_url = 'https://www.fn-tech.com'
    list_url = f'{base_url}/news.html'

    print(f'Fetching news list from {list_url}...', file=sys.stderr)
    raw = fetch_with_curl(list_url)
    html = decode_content(raw)

    if not html:
        print('Failed to fetch news list', file=sys.stderr)
        return

    # Extract article URLs from first page
    article_urls = extract_article_urls(html)
    print(f'Page 1: Found {len(article_urls)} article URLs', file=sys.stderr)

    all_urls: list[str] = list(article_urls)

    # Check for pagination and fetch all pages
    page_num = 1
    max_pages = 50

    while page_num < max_pages:
        next_page_url = f'{base_url}/news.html?page={page_num + 1}'
        print(f'Fetching {next_page_url}...', file=sys.stderr)

        page_raw = fetch_with_curl(next_page_url)
        if not page_raw:
            print(f'  Failed to fetch page {page_num + 1}', file=sys.stderr)
            break

        page_html = decode_content(page_raw)
        page_article_urls = extract_article_urls(page_html)

        if not page_article_urls:
            print(f'  No articles found on page {page_num + 1}, stopping', file=sys.stderr)
            break

        new_urls = [u for u in page_article_urls if u not in all_urls]
        all_urls.extend(new_urls)
        print(f'  Found {len(new_urls)} new articles (total: {len(all_urls)})', file=sys.stderr)

        # Check if there's a next page link
        if len(page_article_urls) < 10:  # Less than 10 articles likely means last page
            print(f'  Likely last page (only {len(page_article_urls)} articles)', file=sys.stderr)
            break

        page_num += 1

    print(f'\nTotal unique article URLs: {len(all_urls)}', file=sys.stderr)

    # Fetch each article detail
    articles: list[dict] = []
    for i, url in enumerate(all_urls):
        full_url = url if url.startswith('http') else f'{base_url}{url}'
        print(f'[{i+1}/{len(all_urls)}] {full_url}', file=sys.stderr)

        # Retry up to 3 times
        article = None
        for attempt in range(3):
            try:
                article = fetch_article_detail(full_url)
                if article and article['title']:
                    break
            except Exception as e:
                print(f'  Attempt {attempt + 1} failed: {e}', file=sys.stderr)

        if article and article['title']:
            articles.append(article)
            print(f'  OK: {article["title"][:50]}... (date: {article["date"]})', file=sys.stderr)
        else:
            print(f'  FAILED after retries', file=sys.stderr)

    # Sort by date (newest first)
    articles.sort(key=lambda x: x['date'], reverse=True)

    # Save results
    output_path = Path(__file__).parent / 'fn-tech-news.json'
    output_path.write_text(json.dumps(articles, ensure_ascii=False, indent=2), encoding='utf-8')

    print(f'\nSaved {len(articles)} articles to {output_path}', file=sys.stderr)

    # Print summary
    for i, a in enumerate(articles[:5]):
        print(f'  {i+1}. [{a["date"]}] {a["title"][:50]}', file=sys.stderr)
    if len(articles) > 5:
        print(f'  ... and {len(articles) - 5} more', file=sys.stderr)


if __name__ == '__main__':
    scrape_news()
