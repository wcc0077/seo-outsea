/**
 * Scrape application images from fn-tech.com
 *
 * Usage: node scripts/scrape-application-images.js
 */

const playwright = require("playwright");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const BASE_URL = "https://www.fn-tech.com";
const OUTPUT_DIR = path.join(__dirname, "scraped-images");

// Application URLs from original site (by category)
const APPLICATION_URLS = {
  "smart-manufacturing": [
    "/application/137.html",
    "/application/139.html",
    "/application/259.html",
    "/application/421.html",
    "/application/422.html",
    "/application/426.html",
    "/application/427.html",
    "/application/436.html",
    "/application/441.html",
  ],
  "warehouse-logistics": [
    "/application/142.html",
    "/application/143.html",
    "/application/144.html",
    "/application/145.html",
    "/application/146.html",
    "/application/148.html",
  ],
  "archive-library": [
    "/application/149.html",
  ],
  "asset-inspection": [
    "/application/152.html",
    "/application/153.html",
    "/application/154.html",
  ],
  "anti-counterfeit": [
    "/application/157.html",
    "/application/158.html",
  ],
  "retail-supply-chain": [
    "/application/161.html",
    "/application/162.html",
  ],
  "smart-city": [
    "/application/167.html",
    "/application/168.html",
    "/application/169.html",
    "/application/170.html",
  ],
};

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);

    protocol
      .get(url, (res) => {
        if (res.statusCode === 200) {
          res.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve(true);
          });
        } else if (res.statusCode === 301 || res.statusCode === 302) {
          // Follow redirect
          file.close();
          fs.unlink(destPath, () => {});
          downloadImage(res.headers.location, destPath).then(resolve);
        } else {
          file.close();
          fs.unlink(destPath, () => {});
          resolve(false);
        }
      })
      .on("error", () => {
        file.close();
        fs.unlink(destPath, () => {});
        resolve(false);
      });
  });
}

async function scrapeApplicationImages(page, url, categorySlug) {
  try {
    const fullUrl = `${BASE_URL}${url}`;
    console.log(`    Loading: ${fullUrl}`);

    await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);

    // Get application name and images
    const data = await page.evaluate(() => {
      // Get application name from H2 or page title
      const h2El = document.querySelector("h2");
      const titleEl = document.querySelector("h1");
      const name = (h2El ? h2El.textContent.trim() : "") ||
                   (titleEl ? titleEl.textContent.trim() : "") ||
                   document.title.split("-")[0].trim();

      // Get main product/application image
      const mainImg = document.querySelector(".wp-tb_product_detail-imgpreview img, .detail-img img, .product-img img");
      const mainImageUrl = mainImg ? (mainImg.src || mainImg.getAttribute("data-src") || "") : "";

      // Get thumbnail images
      const thumbImgs = document.querySelectorAll(".wp-new-prodcuts-detail-picture-small-element img, .thumb-img img");
      const thumbUrls = Array.from(thumbImgs)
        .map(img => img.src || img.getAttribute("data-src") || "")
        .filter(url => url && !url.includes("loading.gif") && !url.includes("placeholder"));

      // Get content images
      const contentImgs = document.querySelectorAll(".content img, .article-content img, .prodcut-detail-content img");
      const contentUrls = Array.from(contentImgs)
        .map(img => img.src || img.getAttribute("data-src") || "")
        .filter(url => url && !url.includes("loading.gif"));

      // Combine and dedupe
      const allImages = [mainImageUrl, ...thumbUrls, ...contentUrls].filter(Boolean);
      const uniqueImages = [...new Set(allImages)];

      return { name, images: uniqueImages };
    });

    if (!data.name) {
      console.log(`    No name found for ${url}`);
      return null;
    }

    console.log(`    Found: ${data.name} (${data.images.length} images)`);

    return {
      name: data.name,
      url,
      categorySlug,
      images: data.images.map(img => {
        if (img.startsWith("//")) return "https:" + img;
        if (img.startsWith("/")) return BASE_URL + img;
        return img;
      }),
    };
  } catch (e) {
    console.error(`    Failed: ${url} - ${e.message}`);
    return null;
  }
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s一-龥-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

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

  const applicationData = [];
  const downloadedImages = [];

  console.log("=== Scraping Application Images ===\n");

  for (const [categorySlug, urls] of Object.entries(APPLICATION_URLS)) {
    console.log(`[${categorySlug}]`);

    for (const url of urls) {
      const data = await scrapeApplicationImages(page, url, categorySlug);

      if (data && data.images.length > 0) {
        const slug = generateSlug(data.name);

        applicationData.push({
          name: data.name,
          slug,
          categorySlug,
          url: data.url,
          images: data.images,
        });

        // Download first image
        const imageUrl = data.images[0];
        const ext = imageUrl.split("?")[0].split(".").pop() || "jpg";
        const imageName = `${slug.slice(0, 50)}-1.${ext}`;
        const localPath = path.join(OUTPUT_DIR, imageName);

        console.log(`    Downloading: ${imageUrl}`);
        const success = await downloadImage(imageUrl, localPath);

        if (success) {
          downloadedImages.push({
            applicationSlug: slug,
            applicationName: data.name,
            localPath,
            originalUrl: imageUrl,
          });
          console.log(`    Saved: ${imageName}`);
        } else {
          console.log(`    Failed to download`);
        }
      }

      await page.waitForTimeout(500);
    }
  }

  await browser.close();

  // Save JSON mapping
  const dataPath = path.join(OUTPUT_DIR, "application-images.json");
  fs.writeFileSync(dataPath, JSON.stringify(applicationData, null, 2), "utf-8");

  console.log("\n=== Summary ===");
  console.log(`Applications scraped: ${applicationData.length}`);
  console.log(`Images downloaded: ${downloadedImages.length}`);
  console.log(`Output dir: ${OUTPUT_DIR}`);
  console.log(`Data file: ${dataPath}`);

  // Print mapping
  console.log("\n=== Downloaded Images ===");
  downloadedImages.forEach(img => {
    console.log(`${img.applicationName} -> ${path.basename(img.localPath)}`);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});