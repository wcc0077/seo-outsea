#!/usr/bin/env python3
"""
Import scraped news articles into Strapi backend.
Reads from /tmp/fn-tech-news.json and creates articles via Strapi API.
"""

import json
import os
import sys
from pathlib import Path

import requests


def import_news_to_strapi():
    strapi_url = os.getenv('NEXT_PUBLIC_STRAPI_URL', 'http://localhost:1337')
    api_token = os.getenv('NEXT_PUBLIC_STRAPI_API_TOKEN', '')

    # Load scraped data
    data_path = Path('/tmp/fn-tech-news.json')
    if not data_path.exists():
        print('Error: /tmp/fn-tech-news.json not found', file=sys.stderr)
        return

    with open(data_path, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    print(f'Loaded {len(articles)} articles from {data_path}', file=sys.stderr)

    # Prepare headers
    headers = {
        'Content-Type': 'application/json',
    }
    if api_token:
        headers['Authorization'] = f'Bearer {api_token}'

    created = 0
    skipped = 0
    errors = []

    for i, article in enumerate(articles):
        title = article['title']
        content = article['content']
        publish_date = article['date']

        # Generate slug from title (simplified)
        import re
        slug = re.sub(r'[^\w\s-]', '', title).strip().replace(' ', '-')[:100]
        if not slug:
            slug = f'article-{i+1}'

        # Check if article already exists
        try:
            check_url = f'{strapi_url}/api/news?filters[slug][$eq]={slug}&locale=en'
            check_resp = requests.get(check_url, headers=headers, timeout=10)
            if check_resp.status_code == 200:
                existing = check_resp.json().get('data', [])
                if existing:
                    print(f'[{i+1}/{len(articles)}] SKIP: {title[:40]}... (already exists)', file=sys.stderr)
                    skipped += 1
                    continue
        except Exception as e:
            print(f'[{i+1}/{len(articles)}] WARNING: Could not check existence: {e}', file=sys.stderr)

        # Prepare article data
        article_data = {
            'data': {
                'title': title,
                'slug': slug,
                'content': content,
                'publishDate': publish_date,
                'author': '孚恩科技',
                'publishedAt': publish_date,
                'locale': 'en',
            }
        }

        try:
            create_url = f'{strapi_url}/api/news'
            resp = requests.post(create_url, json=article_data, headers=headers, timeout=30)

            if resp.status_code in [200, 201]:
                created += 1
                print(f'[{i+1}/{len(articles)}] OK: {title[:40]}...', file=sys.stderr)
            else:
                errors.append(f'Article {i+1} ({title[:40]}): {resp.status_code} - {resp.text[:200]}')
                print(f'[{i+1}/{len(articles)}] ERROR: {resp.status_code}', file=sys.stderr)
        except Exception as e:
            errors.append(f'Article {i+1} ({title[:40]}): {str(e)}')
            print(f'[{i+1}/{len(articles)}] EXCEPTION: {e}', file=sys.stderr)

    print(f'\nImport complete!', file=sys.stderr)
    print(f'  Created: {created}', file=sys.stderr)
    print(f'  Skipped: {skipped}', file=sys.stderr)
    print(f'  Errors: {len(errors)}', file=sys.stderr)

    if errors:
        print('\nErrors:', file=sys.stderr)
        for err in errors:
            print(f'  - {err}', file=sys.stderr)


if __name__ == '__main__':
    import_news_to_strapi()
