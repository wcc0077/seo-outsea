/**
 * Scrape application images from fn-tech.com and import to Strapi
 *
 * Usage: cd backend && npx ts-node scripts/scrape-application-images.ts
 */

import * as playwright from "playwright";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const BASE_URL = "https://www.fn-tech.com";
const OUTPUT_DIR = path.join(__dirname, "scraped-images");
const STRAPI_UPLOAD_DIR = path.join(__dirname, "..", "public", "uploads");

// Application URLs from original site (by category)
const APPLICATION_URLS: Record<string, string[]> = {
  "smart-manufacturing": [
    "/application/137.html", // RFID 技术在光伏电池片
    "/application/139.html", // RFID 追溯系统如何改写光伏切片工厂
    "/application/259.html", // 引领光伏拉晶厂智能追溯新纪元
    "/application/421.html", // 基于 RFID 技术的汽车制造工业系统
    "/application/422.html", // 光伏拉晶厂 RFID 生产工序管理
    "/application/426.html", // 破解刀具管理难题
    "/application/427.html", // RFID 服装生产线的应用
    "/application/436.html", // 孚恩 RFID 技术在光纤数字化改造
    "/application/441.html", // 2022 非标自动化生产检测线
  ],
  "warehouse-logistics": [
    "/application/142.html", // AGV/RGV 升级智慧大脑
    "/application/143.html", // 优化汽车仓储物流管理
    "/application/144.html", // 孚恩 RFID 叉车改造项目
    "/application/145.html", // 基于 RFID 仓储物流管理系统
    "/application/146.html", // 基于 RFID 技术的仓储物流管理系统应用
    "/application/148.html", // 基于 RFID 技术的水泥出库
  ],
  "archive-library": [
    "/application/149.html", // 朵云书院智慧管理
  ],
  "asset-inspection": [
    "/application/152.html", // 基于 RFID 技术的移动工程车工具
    "/application/153.html", // 基于 RFID 技术的电网资产全寿命周期
    "/application/154.html", // 武汉楚天威豹金融押运系统
  ],
  "anti-counterfeit": [
    "/application/157.html", // RFID 医药防伪系统
    "/application/158.html", // RFID 生猪肉品质量信息可溯源
  ],
  "retail-supply-chain": [
    "/application/161.html", // 基于 RFID 技术的服装物流零售管理系统
    "/application/162.html", // RFID 技术在无人新零售中的应用
  ],
  "smart-city": [
    "/application/167.html", // 基于 RFID 射频识别技术的车辆管理
    "/application/168.html", // 智能小区电动自行车 RFID 防盗
    "/application/169.html", // RFID 技术：藏在娱乐里的黑科技
    "/application/170.html", // 基于 RFID 技术的智能车辆定位及测速
  ],
};

interface ScrapedImage {
  applicationSlug: string;
  applicationName: string;
  categorySlug: string;
  imageUrl: string;
  localPath: string;
}

interface ApplicationRecord {
  id: number;
  name: string;
  slug: string;
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
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

async function scrapeApplicationImages(
  page: playwright.Page,
  url: string,
  categorySlug: string
): Promise<{ name: string; slug: string; images: string[] } | null> {
  try {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);

    // Use string-based evaluate to avoid TypeScript DOM errors
    // Use page.evaluate with proper function (TypeScript ignores DOM types via @ts-ignore)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - document is available in browser context
    const data = await page.evaluate(() => {
      const h2El = document.querySelector("h2.prodetail_title, h2");
      const name = h2El ? h2El.textContent.trim() : "";

      const mainImg = document.querySelector(".wp-tb_product_detail-imgpreview img");
      const mainImageUrl = mainImg ? (mainImg.getAttribute("src") || mainImg.getAttribute("data-src") || "") : "";

      const thumbImgs = document.querySelectorAll(".wp-new-prodcuts-detail-picture-small-element img, .product-thumb img, .detail-img img");
      const thumbUrls = Array.from(thumbImgs).map(img => img.getAttribute("src") || img.getAttribute("data-src") || "").filter(Boolean);

      const showcaseImgs = document.querySelectorAll(".application-img img, .case-img img, .content-img img");
      const showcaseUrls = Array.from(showcaseImgs).map(img => img.getAttribute("src") || img.getAttribute("data-src") || "").filter(Boolean);

      const allImages = [mainImageUrl, ...thumbUrls, ...showcaseUrls].filter(Boolean);
      const uniqueImages = Array.from(new Set(allImages));

      return { name, images: uniqueImages };
    }) as { name: string; images: string[] } | null;

    if (!data.name || data.images.length === 0) {
      console.log(`    No images found for ${url}`);
      return null;
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    return {
      name: data.name,
      slug,
      images: data.images.map((img) => {
        if (img.startsWith("//")) return `https:${img}`;
        if (img.startsWith("/")) return `${BASE_URL}${img}`;
        return img;
      }),
    };
  } catch (e) {
    console.error(`    Failed to scrape ${url}: ${e}`);
    return null;
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(STRAPI_UPLOAD_DIR, { recursive: true });

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

  const scrapedImages: ScrapedImage[] = [];
  const applicationData: Array<{ name: string; slug: string; categorySlug: string; images: string[] }> = [];

  console.log("=== Scraping Application Images ===\n");

  for (const [categorySlug, urls] of Object.entries(APPLICATION_URLS)) {
    console.log(`[${categorySlug}]`);

    for (const url of urls) {
      console.log(`  Scraping: ${url}`);
      const data = await scrapeApplicationImages(page, url, categorySlug);

      if (data && data.images.length > 0) {
        applicationData.push({
          name: data.name,
          slug: data.slug,
          categorySlug,
          images: data.images,
        });

        // Download first image for each application
        const imageUrl = data.images[0];
        const imageExt = imageUrl.split("?")[0].split(".").pop() || "jpg";
        const imageName = `${data.slug}-1.${imageExt}`;
        const localPath = path.join(OUTPUT_DIR, imageName);

        console.log(`    Downloading: ${imageUrl}`);
        const success = await downloadImage(imageUrl, localPath);

        if (success) {
          scrapedImages.push({
            applicationSlug: data.slug,
            applicationName: data.name,
            categorySlug,
            imageUrl,
            localPath,
          });
          console.log(`    Saved: ${localPath}`);
        }
      }
    }
  }

  await browser.close();

  // Save scraped data to JSON
  const dataPath = path.join(OUTPUT_DIR, "application-images.json");
  fs.writeFileSync(dataPath, JSON.stringify(applicationData, null, 2), "utf-8");

  console.log("\n=== Summary ===");
  console.log(`Applications scraped: ${applicationData.length}`);
  console.log(`Images downloaded: ${scrapedImages.length}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Data file: ${dataPath}`);

  // Print mapping for reference
  console.log("\n=== Application-Image Mapping ===");
  for (const img of scrapedImages) {
    console.log(`${img.applicationName} -> ${img.localPath}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});