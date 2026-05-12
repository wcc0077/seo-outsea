/**
 * Scrape application images from fn-tech.com category pages
 * Returns image URLs with application names for direct use (no upload)
 */

const playwright = require("playwright");
const fs = require("fs");
const path = require("path");

const CATEGORY_PAGES = {
  "smart-manufacturing": "/application/20.html",
  "warehouse-logistics": "/application/21.html",
  "archive-library": "/application/22.html",
  "asset-inspection": "/application/23.html",
  "anti-counterfeit": "/application/24.html",
  "retail-supply-chain": "/application/25.html",
  "smart-city": "/application/26.html",
  "smart-cabinet": "/application/27.html",
};

const BASE_URL = "https://www.fn-tech.com";
const OUTPUT_FILE = path.join(__dirname, "scraped-data", "application-images-from-list.json");

async function scrapeCategoryImages(page, category, urlPath) {
  console.log(`Scraping: ${category} (${urlPath})`);

  await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3000);

  const images = await page.evaluate(() => {
    // Find application list items with images
    const items = document.querySelectorAll(".wp-tb_product_list-item, .product-list-item, .application-item, .case-item");
    const results = [];

    // Also check for items with class containing product/case/application
    const allImgs = document.querySelectorAll("img.wp-tb_product_list-thumbnail, img.img_lazy_load");

    allImgs.forEach((img) => {
      const alt = img.alt || "";
      const src = img.src || img.getAttribute("data-src") || "";

      // Filter for application images (have Chinese alt text)
      if (src && alt && alt.length > 5 && /[一-鿥]/.test(alt)) {
        results.push({
          name: alt.trim(),
          imageUrl: src,
        });
      }
    });

    // If no results from thumbnails, try other patterns
    if (results.length === 0) {
      document.querySelectorAll("img").forEach((img) => {
        const alt = img.alt || "";
        const src = img.src || img.getAttribute("data-src") || "";
        if (src && alt && alt.length > 5 && /[一-鿥]/.test(alt) && !alt.includes("上海孚恩")) {
          results.push({
            name: alt.trim(),
            imageUrl: src,
          });
        }
      });
    }

    return results;
  });

  console.log(`  Found: ${images.length} images`);
  images.forEach((img) => console.log(`    - ${img.name}: ${img.imageUrl}`));

  return images;
}

async function main() {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

  const browser = await playwright.chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    locale: "zh-CN",
  });

  const page = await context.newPage();

  const allImages = {};

  for (const [category, urlPath] of Object.entries(CATEGORY_PAGES)) {
    try {
      const images = await scrapeCategoryImages(page, category, urlPath);
      allImages[category] = images;
    } catch (e) {
      console.error(`  Error: ${e.message}`);
      allImages[category] = [];
    }
    await page.waitForTimeout(1000);
  }

  await browser.close();

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allImages, null, 2), "utf-8");

  // Summary
  let total = 0;
  console.log("\n=== Summary ===");
  for (const [category, images] of Object.entries(allImages)) {
    console.log(`${category}: ${images.length} images`);
    total += images.length;
  }
  console.log(`Total: ${total}`);
  console.log(`Saved to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});