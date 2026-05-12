/**
 * Scrape all product data from fn-tech.com
 *
 * Usage: cd backend && npx ts-node scripts/scrape-fn-tech.ts
 *
 * Outputs:
 *   scripts/scraped-data/products.json
 *   scripts/scraped-data/rfid-tags.json
 *   scripts/scraped-data/categories.json
 *   scripts/scraped-data/rfid-tag-categories.json
 */

import * as playwright from "playwright";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_URL = "https://www.fn-tech.com";

// Main category pages and their scraper config
const CATEGORY_CONFIG = {
  mobile: {
    // 智能移动终端 (Smart Mobile Terminals)
    url: `${BASE_URL}/mobile.html`,
    productPattern: /\/mobile_more\/[^"'#]+\.html/,
    subcategoryPattern: /\/mobile\/\d+\.html/,
    parentCategory: "智能移动终端",
    subcategories: {
      "/mobile/5.html": "多功能手持终端",
      "/mobile/6.html": "多功能工业平板",
      "/mobile/7.html": "便携式RFID读写器",
    },
    // Subcategory pages that map to product category
    subPagesToProductCategory: {
      "/mobile/5.html": "多功能手持终端",
      "/mobile/6.html": "多功能工业平板",
      "/mobile/7.html": "便携式RFID读写器",
    },
  },
  rfid: {
    // RFID读写器 (RFID Readers)
    url: `${BASE_URL}/rfid.html`,
    productPattern: /\/rfid_more\/[^"'#]+\.html/,
    subcategoryPattern: /\/rfid\/\d+\.html/,
    parentCategory: "RFID读写器",
    subcategories: {
      "/rfid/8.html": "高频系列RFID读写器",
      "/rfid/9.html": "超高频系列RFID读写器",
      "/rfid/35.html": "工业协议网关控制器",
      "/rfid/11.html": "有源系列RFID读写器",
      "/rfid/36.html": "低频系列RFID读写器",
      "/rfid/28.html": "RFID集成产品",
    },
  },
  "frid-tag": {
    // RFID电子标签 (RFID Electronic Tags)
    url: `${BASE_URL}/frid-tag.html`,
    productPattern: /\/frid-tag_more\/[^"'#]+\.html/,
    subcategoryPattern: /\/frid-tag\/\d+\.html/,
    parentCategory: "RFID电子标签",
    subcategories: {
      "/frid-tag/13.html": "RFID耐高温标签",
      "/frid-tag/14.html": "RFID抗金属标签",
      "/frid-tag/15.html": "RFID易碎防转移标签",
      "/frid-tag/16.html": "智能卡与不干胶标签",
      "/frid-tag/17.html": "其他特种标签",
      "/frid-tag/18.html": "有源电子标签",
    },
  },
};

// Frequency mapping from filter text
const FREQUENCY_MAP: Record<string, string> = {
  "UHF（860~960MHz）": "uhf",
  "UHF(860~960MHz)": "uhf",
  "UHF（860-960MHz）": "uhf",
  HF: "hf",
  "HF（13.56MHz）": "hf",
  "HF(13.56MHz)": "hf",
  "LF（125KHz)": "lf-125khz",
  "LF（125KHz）": "lf-125khz",
  "LF（134.2KHz）": "lf-134khz",
  "VHF(2.45GHz)": "vhf",
  "VHF（2.45GHz）": "vhf",
};

// OS mapping
const OS_MAP: Record<string, string> = {
  Android: "android",
  android: "android",
  Windows: "windows",
  windows: "windows",
  其它: "other",
  其他: "other",
};

// Tag type mapping from subcategory name
const TAG_TYPE_MAP: Record<string, string> = {
  "RFID耐高温标签": "high-temp",
  "RFID抗金属标签": "anti-metal",
  "RFID易碎防转移标签": "flexible",
  "智能卡与不干胶标签": "card",
  "其他特种标签": "custom",
  "有源电子标签": "key-fob",
  "RFID工业载码体": "carrier",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScrapedProduct {
  name: string;
  slug: string;
  description: string;
  features: string[];
  specsRaw: string; // key-value pairs extracted from specs table
  specsText: string; // raw spec table text for reference
  mainImage: string;
  images: string[];
  category: string;
  parentCategory: string;
  subcategory: string;
  frequency: string;
  os: string;
  connectivity: string[];
  seoTitle: string;
  seoKeywords: string;
  url: string;
}

interface ScrapedRfidTag {
  name: string;
  model: string;
  slug: string;
  description: string;
  tagType: string;
  frequency: string;
  category: string;
  parentCategory: string;
  subcategory: string;
  specsRaw: string;
  specsText: string;
  mainImage: string;
  images: string[];
  seoTitle: string;
  seoKeywords: string;
  url: string;
}

interface CategoryRecord {
  name: string;
  slug: string;
  parent: string | null;
  sortOrder: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Category name → ASCII slug (Strapi requires ASCII-only slugs)
const CATEGORY_SLUG_MAP: Record<string, string> = {
  '智能移动终端': 'smart-mobile-terminals',
  '多功能手持终端': 'handheld-terminals',
  '多功能工业平板': 'industrial-tablets',
  '便携式RFID读写器': 'portable-rfid-readers',
  'RFID读写器': 'rfid-readers',
  '高频系列RFID读写器': 'hf-rfid-readers',
  '超高频系列RFID读写器': 'uhf-rfid-readers',
  '工业协议网关控制器': 'protocol-gateway-controllers',
  '有源系列RFID读写器': 'active-rfid-readers',
  '低频系列RFID读写器': 'lf-rfid-readers',
  'RFID集成产品': 'rfid-integrated-products',
  'RFID电子标签': 'rfid-tags',
  'RFID耐高温标签': 'high-temperature-tags',
  'RFID抗金属标签': 'anti-metal-tags',
  'RFID易碎防转移标签': 'fragile-tamper-proof-tags',
  '智能卡与不干胶标签': 'smart-card-sticker-tags',
  '其他特种标签': 'other-special-tags',
  '有源电子标签': 'active-tags',
};

function categorySlug(name: string): string {
  return CATEGORY_SLUG_MAP[name] || slugify(name);
}

function normalizeUrl(href: string): string {
  if (href.startsWith("http")) return href;
  if (href.startsWith("/")) return `${BASE_URL}${href}`;
  return `${BASE_URL}/${href}`;
}

function extractPathFromUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname;
  } catch {
    return url;
  }
}

function extractFrequency(text: string): string | null {
  for (const [key, value] of Object.entries(FREQUENCY_MAP)) {
    if (text.includes(key)) return value;
  }
  // Also try patterns like "13.56MHz", "860~960MHz"
  if (/13\.56\s*MHz/i.test(text)) return "hf";
  if (/860.*960\s*MHz/i.test(text)) return "uhf";
  if (/125\s*KHz/i.test(text)) return "lf-125khz";
  if (/134\.2\s*KHz/i.test(text)) return "lf-134khz";
  if (/2\.45\s*GHz/i.test(text)) return "vhf";
  if (/2400.*2483\.5\s*MHz/i.test(text)) return "vhf";
  return null;
}

function extractOS(text: string): string | null {
  if (/Android/i.test(text)) return "android";
  if (/Windows/i.test(text)) return "windows";
  return null;
}

function extractConnectivity(text: string): string[] {
  const conns: string[] = [];
  const patterns = [
    { re: /4G|4G全网通/g, name: "4G全网通" },
    { re: /WIFI|Wi-Fi|WiFi|无线/gi, name: "WIFI" },
    { re: /蓝牙|BT\d|Bluetooth/gi, name: "蓝牙" },
    { re: /TCP\/IP|Modbus\s*TCP|Profinet|EtherNet/gi, name: "TCP/IP" },
    { re: /RS485|RS-485/gi, name: "RS485" },
    { re: /RS232|RS-232/gi, name: "RS232" },
    { re: /USB|Type-C|OTG/gi, name: "USB" },
    { re: /POE|PoE/gi, name: "POE" },
    { re: /IO-Link|IOLink/gi, name: "IO-Link" },
    { re: /CAN|CANopen/gi, name: "CAN" },
    { re: /Wiegand|维根/gi, name: "Wiegand" },
    { re: /MQTT/gi, name: "MQTT" },
  ];
  for (const p of patterns) {
    if (p.re.test(text)) {
      conns.push(p.name);
      p.re.lastIndex = 0; // reset for next test
    }
  }
  return conns;
}

function extractFeatures(text: string): string[] {
  // The description area typically has 4-6 bullet-point-like feature descriptions
  // They are separated by the special character \xa0 (non-breaking space)
  const cleaned = text.replace(/\xa0/g, "").trim();
  // Split by common feature separators
  const lines = cleaned
    .split(/(?=[一-鿿]{2,}[：:])/)
    .filter((l) => l.trim().length > 3)
    .map((l) => l.replace(/^\s*[·•\*\-]+\s*/, "").trim());
  return lines.slice(0, 6); // cap at 6 features
}

function parseSpecTable(tableText: string): Record<string, string> {
  // Parse spec table text into key-value pairs
  const specs: Record<string, string> = {};
  const lines = tableText.split("\n").map((l) => l.trim()).filter(Boolean);

  // Try to find label: value patterns
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match patterns like "处理器\tMTK6762WD" or "操作系统: Android10.0"
    const kvMatch = line.match(/^([^:\t一-鿿]*[:\t])\s*(.+)$/);
    if (kvMatch) {
      const key = kvMatch[1].replace(/[:\t]/g, "").trim();
      const value = kvMatch[2].trim();
      if (key && value) {
        specs[key] = value;
      }
    }
  }
  return specs;
}

// ---------------------------------------------------------------------------
// Scraper
// ---------------------------------------------------------------------------

async function scrapeAllProductUrls(
  page: playwright.Page,
  config: (typeof CATEGORY_CONFIG)[keyof typeof CATEGORY_CONFIG]
): Promise<Map<string, string>> {
  // Map of product URL -> subcategory name
  const productUrls = new Map<string, string>();

  // NOTE: Visit subcategories FIRST (more specific), then main page for unmatched URLs.

  // Visit each subcategory page FIRST (more specific, better category info)
  for (const [subPath, subName] of Object.entries(config.subcategories)) {
    const subUrl = `${BASE_URL}${subPath}`;
    console.log(`    Subcategory: ${subName} (${subPath})`);
    await page.goto(subUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);

    const subProducts = await page.evaluate(
      (patternStr: string) => {
        const pattern = new RegExp(patternStr);
        const links = document.querySelectorAll("a[href]");
        const results: { href: string; title: string }[] = [];
        const seen = new Set<string>();
        links.forEach((a) => {
          const href = a.getAttribute("href") || "";
          const title = a.getAttribute("title") || "";
          if (pattern.test(href) && !seen.has(href)) {
            seen.add(href);
            results.push({ href, title });
          }
        });
        return results;
      },
      config.productPattern.source
    );

    for (const p of subProducts) {
      const url = normalizeUrl(p.href);
      // First-come-first-served: don't overwrite a more specific subcategory
      // (some subcategory pages list products from other subcategories)
      if (!productUrls.has(url)) {
        productUrls.set(url, subName);
      }
    }

    // Handle JS pagination (###N links)
    let pageNum = 1;
    const maxPages = 10;
    while (pageNum < maxPages) {
      const hasNext = await page.evaluate(() => {
        const hashLinks = Array.from(document.querySelectorAll('a[href^="###"]'));
        const nextPage = hashLinks.find((a) => {
          const text = a.textContent.trim();
          return text.includes(">>") || text === String(parseInt(a.getAttribute("href")?.replace("###", "") || "1") + 1);
        });
        return nextPage ? true : false;
      });

      if (!hasNext) break;

      // Click page 2 (or next page)
      await page.evaluate(() => {
        const hashLinks = Array.from(document.querySelectorAll('a[href^="###"]'));
        // Find the link with highest ###N number
        let maxPage = 0;
        let targetLink: HTMLElement | null = null;
        hashLinks.forEach((a) => {
          const href = a.getAttribute("href") || "";
          const pageNum = parseInt(href.replace("###", ""));
          if (pageNum > maxPage) {
            maxPage = pageNum;
            targetLink = a;
          }
        });
        if (targetLink) {
          targetLink.click();
        }
      });

      await page.waitForTimeout(2000);

      const pageProducts = await page.evaluate(
        (patternStr: string) => {
          const pattern = new RegExp(patternStr);
          const links = document.querySelectorAll("a[href]");
          const results: { href: string }[] = [];
          const seen = new Set<string>();
          links.forEach((a) => {
            const href = a.getAttribute("href") || "";
            if (pattern.test(href) && !seen.has(href)) {
              seen.add(href);
              results.push({ href });
            }
          });
          return results;
        },
        config.productPattern.source
      );

      let added = false;
      for (const p of pageProducts) {
        const url = normalizeUrl(p.href);
        if (!productUrls.has(url)) {
          productUrls.set(url, subName);
          added = true;
        }
      }

      if (!added) break;
      pageNum++;

      // Check if we reached the last page
      const isLastPage = await page.evaluate(() => {
        const hashLinks = Array.from(document.querySelectorAll('a[href^="###"]'));
        const nextPageLinks = hashLinks.filter((a) => {
          const text = a.textContent.trim();
          return text.includes(">>") || text.includes("末页");
        });
        return nextPageLinks.length > 0;
      });

      if (isLastPage && pageNum >= 2) break;
    }
  }

  // Fallback: scrape main category page for any unmatched product URLs
  console.log(`  Fallback: checking main page ${config.url}...`);
  await page.goto(config.url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);

  const mainProducts = await page.evaluate(
    (patternStr: string) => {
      const pattern = new RegExp(patternStr);
      const links = document.querySelectorAll("a[href]");
      const results: { href: string }[] = [];
      const seen = new Set<string>();
      links.forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (pattern.test(href) && !seen.has(href)) {
          seen.add(href);
          results.push({ href });
        }
      });
      return results;
    },
    config.productPattern.source
  );

  for (const p of mainProducts) {
    const url = normalizeUrl(p.href);
    if (!productUrls.has(url)) {
      productUrls.set(url, ""); // unmatched — no subcategory info
    }
  }

  return productUrls;
}

async function scrapeProductDetail(
  page: playwright.Page,
  url: string,
  subcategory: string,
  parentCategory: string,
  key: "mobile" | "rfid" | "frid-tag"
): Promise<ScrapedProduct | ScrapedRfidTag | null> {
  console.log(`    Scraping: ${url}`);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);
  } catch (e) {
    console.error(`    Failed to load ${url}: ${e}`);
    return null;
  }

  const data = await page.evaluate((url) => {
    // Product name from H2
    const h2El = document.querySelector("h2.prodetail_title");
    const name = h2El ? h2El.textContent.trim() : "";

    // Description from right panel
    const rightPanel = document.querySelector(".wp-new-prodcuts-detail-right");
    const rightText = rightPanel ? rightPanel.textContent : "";

    // Extract description (before the price/market price section)
    let description = rightText;
    const marketPriceIdx = rightText.indexOf("市场价");
    if (marketPriceIdx > 0) {
      description = rightText.substring(0, marketPriceIdx).trim();
    }

    // Extract filter info (RFID frequency, connectivity)
    const filterItems = document.querySelectorAll(".filter_attr_new li, .filter_item li");
    const filters = Array.from(filterItems).map((li) => li.textContent.trim());

    // Extract images
    const mainImg = document.querySelector(".wp-tb_product_detail-imgpreview") as HTMLImageElement | null;
    const mainImage = mainImg ? mainImg.getAttribute("src") || "" : "";

    const thumbImgs = document.querySelectorAll(".wp-new-prodcuts-detail-picture-small-element img");
    const thumbnails = Array.from(thumbImgs)
      .map((img) => img.getAttribute("src") || img.getAttribute("data-src") || "")
      .filter(Boolean);

    // Unique images
    const allImages = [mainImage, ...thumbnails].filter(Boolean);
    const uniqueImages = Array.from(new Set(allImages));

    // Prev/Next links
    const allLinks = Array.from(document.querySelectorAll("a[href]"));
    const prevMatch = allLinks.find((a) => a.textContent.includes("上一个"));
    const nextMatch = allLinks.find((a) => a.textContent.includes("下一个"));
    const prevProduct = prevMatch ? prevMatch.getAttribute("href") || "" : "";
    const nextProduct = nextMatch ? nextMatch.getAttribute("href") || "" : "";

    // Page title
    const pageTitle = document.title;

    // Get full text content for additional extraction
    const bodyText = document.body.innerText;

    return {
      name,
      description,
      filters,
      mainImage,
      uniqueImages,
      prevProduct,
      nextProduct,
      pageTitle,
      bodyText: bodyText.substring(0, 5000),
      url,
    };
  }, url);

  if (!data.name) {
    console.error(`    No product name found for ${url}, skipping`);
    return null;
  }

  // Click on 基本参数 tab to get specs
  await page.evaluate(() => {
    const paramTab = document.querySelector('.goods_info_txt[data="1"]') as HTMLElement | null;
    if (paramTab) paramTab.click();
  });
  await page.waitForTimeout(1000);

  // Extract specs from the now-visible spec table
  const specsText = await page.evaluate(() => {
    // Find the table that contains spec data (typically has key-value pairs)
    const tables = document.querySelectorAll("table");
    // Look for the largest/most content-rich table (usually the specs table)
    let bestTable = "";
    let bestLength = 0;
    tables.forEach((t) => {
      const text = t.innerText || "";
      if (text.length > bestLength) {
        bestLength = text.length;
        bestTable = text;
      }
    });
    return bestTable;
  });

  // Also try to get specs from visible table cells in a structured way
  const specsKeyValue = await page.evaluate(() => {
    const result: Record<string, string> = {};
    // Try to find spec rows with label-value structure
    const tables = document.querySelectorAll("table");
    tables.forEach((table) => {
      const rows = table.querySelectorAll("tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td, th");
        if (cells.length >= 2) {
          // Look for a label followed by value pattern
          for (let i = 0; i < cells.length - 1; i++) {
            const label = cells[i].innerText.trim();
            const value = cells[i + 1].innerText.trim();
            if (label && value && label.length < 30 && value.length > 2) {
              // Skip nav/menu labels
              if (!label.includes("分类") && !label.includes("推荐") && !label.includes("产品")) {
                result[label] = value;
              }
            }
          }
        }
      });
    });
    return result;
  });

  // Extract frequency from filters, description, and specs
  const allText = data.description + " " + specsText + " " + data.filters.join(" ");
  const frequency = extractFrequency(allText);
  const os = extractOS(allText);
  const connectivity = extractConnectivity(allText);

  // Extract features
  const features = extractFeatures(data.description);

  // SEO data
  const seoTitle = data.pageTitle;
  const seoKeywords = data.pageTitle
    .split(",")
    .map((s) => s.trim())
    .join(", ");

  // Determine if this is a product or RFID tag
  const isRfidTag = key === "frid-tag";

  if (isRfidTag) {
    // Extract model number from name (e.g., "HT712 耐高温..." -> "HT712")
    const modelMatch = data.name.match(/^([A-Z]{1,3}\d{2,4})/i);
    const model = modelMatch ? modelMatch[1] : "";

    // Tag type from subcategory
    const tagType = TAG_TYPE_MAP[subcategory] || "custom";

    // Frequency mapping for RFID tags (use enum values from schema)
    let freqEnum = "UHF";
    if (frequency === "hf") freqEnum = "HF";
    else if (frequency === "lf-125khz" || frequency === "lf-134khz") freqEnum = "LF";
    else if (frequency === "vhf") freqEnum = "active";
    else if (frequency === "uhf") freqEnum = "UHF";

    const rfidTag: ScrapedRfidTag = {
      name: data.name,
      model,
      slug: slugify(data.name),
      description: data.description,
      tagType,
      frequency: freqEnum,
      category: subcategory,
      parentCategory,
      subcategory,
      specsRaw: JSON.stringify(specsKeyValue),
      specsText,
      mainImage: data.mainImage,
      images: data.uniqueImages,
      seoTitle,
      seoKeywords,
      url: data.url,
    };
    return rfidTag;
  } else {
    // Regular product
    const product: ScrapedProduct = {
      name: data.name,
      slug: slugify(data.name),
      description: data.description,
      features,
      specsRaw: JSON.stringify(specsKeyValue),
      specsText,
      mainImage: data.mainImage,
      images: data.uniqueImages,
      category: subcategory,
      parentCategory,
      subcategory,
      frequency: frequency || "",
      os: os || "",
      connectivity,
      seoTitle,
      seoKeywords,
      url: data.url,
    };
    return product;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const outputDir = path.join(__dirname, "scraped-data");
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await playwright.chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    locale: "zh-CN",
  });

  const page = await context.newPage();

  // Aggregate data
  const allProducts: ScrapedProduct[] = [];
  const allRfidTags: ScrapedRfidTag[] = [];
  const allCategories: CategoryRecord[] = [];

  // Build category records upfront
  for (const [key, config] of Object.entries(CATEGORY_CONFIG)) {
    const parentSlug = categorySlug(config.parentCategory);
    allCategories.push({
      name: config.parentCategory,
      slug: parentSlug,
      parent: null,
      sortOrder: Object.keys(CATEGORY_CONFIG).indexOf(key) + 1,
    });

    for (const [subPath, subName] of Object.entries(config.subcategories)) {
      allCategories.push({
        name: subName,
        slug: categorySlug(subName),
        parent: parentSlug,
        sortOrder: 0,
      });
    }
  }

  // Scrape each main category
  for (const [key, config] of Object.entries(CATEGORY_CONFIG)) {
    console.log(`\n[${config.parentCategory}]`);

    const productUrls = await scrapeAllProductUrls(page, config);
    console.log(`  Found ${productUrls.size} unique product URLs`);

    for (const [url, subcategory] of productUrls.entries()) {
      const data = await scrapeProductDetail(page, url, subcategory || "", config.parentCategory, key as "mobile" | "rfid" | "frid-tag");

      if (!data) continue;

      const isRfidTag = key === "frid-tag";
      if (isRfidTag) {
        allRfidTags.push(data as ScrapedRfidTag);
      } else {
        allProducts.push(data as ScrapedProduct);
      }
    }
  }

  await browser.close();

  // -----------------------------------------------------------------------
  // Deduplicate by slug
  // -----------------------------------------------------------------------

  const dedupProducts = new Map<string, ScrapedProduct>();
  for (const p of allProducts) {
    if (!dedupProducts.has(p.slug)) {
      dedupProducts.set(p.slug, p);
    }
  }

  const dedupRfidTags = new Map<string, ScrapedRfidTag>();
  for (const t of allRfidTags) {
    if (!dedupRfidTags.has(t.slug)) {
      dedupRfidTags.set(t.slug, t);
    }
  }

  const uniqueProducts = Array.from(dedupProducts.values());
  const uniqueRfidTags = Array.from(dedupRfidTags.values());

  // -----------------------------------------------------------------------
  // Output
  // -----------------------------------------------------------------------

  const productsPath = path.join(outputDir, "products.json");
  const rfidTagsPath = path.join(outputDir, "rfid-tags.json");
  const categoriesPath = path.join(outputDir, "categories.json");

  fs.writeFileSync(productsPath, JSON.stringify(uniqueProducts, null, 2), "utf-8");
  fs.writeFileSync(rfidTagsPath, JSON.stringify(uniqueRfidTags, null, 2), "utf-8");
  fs.writeFileSync(categoriesPath, JSON.stringify(allCategories, null, 2), "utf-8");

  // -----------------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------------

  console.log("\n========== SCRAPE COMPLETE ==========");
  console.log(`Products:       ${uniqueProducts.length}`);
  console.log(`RFID Tags:      ${uniqueRfidTags.length}`);
  console.log(`Categories:     ${allCategories.length}`);
  console.log(`\nOutput files:`);
  console.log(`  ${productsPath}`);
  console.log(`  ${rfidTagsPath}`);
  console.log(`  ${categoriesPath}`);

  // Print product summary
  if (uniqueProducts.length > 0) {
    console.log("\n--- Products ---");
    for (const p of uniqueProducts) {
      console.log(`  ${p.name} [${p.category}] freq=${p.frequency} os=${p.os}`);
    }
  }

  if (uniqueRfidTags.length > 0) {
    console.log("\n--- RFID Tags ---");
    for (const t of uniqueRfidTags) {
      console.log(`  ${t.name} [${t.subcategory}] freq=${t.frequency} type=${t.tagType}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
