/**
 * Download placeholder images from Unsplash for applications
 *
 * Usage: node scripts/download-unsplash-images.js
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "scraped-images");

// Unsplash image URLs for each category (industrial/business themed)
const CATEGORY_IMAGES = {
  "smart-manufacturing": [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee288?w=800", // Factory automation
    "https://images.unsplash.com/photo-1565193566173-7a0ee3be42c4?w=800", // Industrial robot
    "https://images.unsplash.com/photo-1518310383802-640c2de31135?w=800", // Manufacturing
    "https://images.unsplash.com/photo-1581092160561-8a7f8a8b9c5c?w=800", // Electronics
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", // Production line
    "https://images.unsplash.com/photo-1517976547714-720226b864c1?w=800", // Industrial
    "https://images.unsplash.com/photo-1581092918056-0c4c1acd8da3?w=800", // Machinery
    "https://images.unsplash.com/photo-1581092920614-bff116c6a1e6?w=800", // Tech
    "https://images.unsplash.com/photo-1581092920483-8f2628e7d5fe?w=800", // Engineering
  ],
  "warehouse-logistics": [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3998f1c?w=800", // Warehouse
    "https://images.unsplash.com/photo-1553413077-190dd3050092?w=800", // Logistics
    "https://images.unsplash.com/photo-1565043589221-1a23c8c2eab8?w=800", // Shipping
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c8c3?w=800", // Forklift
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5157?w=800", // Cargo
    "https://images.unsplash.com/photo-1580674285054-31b4b0a351e8?w=800", // Storage
  ],
  "archive-library": [
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800", // Library
  ],
  "asset-inspection": [
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800", // Inspection
    "https://images.unsplash.com/photo-1565891741441-64926e441838?w=800", // Security
    "https://images.unsplash.com/photo-1551287180-4c65ad47c7b6?w=800", // Finance
  ],
  "anti-counterfeit": [
    "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800", // Security check
    "https://images.unsplash.com/photo-1542838132-92c7a0ae0c18?w=800", // Traceability
  ],
  "retail-supply-chain": [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800", // Retail store
    "https://images.unsplash.com/photo-1556742049-0cfed4f6c452?w=800", // Shopping
  ],
  "smart-city": [
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800", // City skyline
    "https://images.unsplash.com/photo-1519501029033-9be824465d5e?w=800", // Urban
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10f00?w=800", // Entertainment
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2f00?w=800", // Traffic
  ],
  "smart-cabinet": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", // Cabinet storage
  ],
};

// Application mapping - match database slugs to images
const APPLICATION_IMAGE_MAP = {
  // smart-manufacturing
  "rfid-cnc-tool-management": 0,
  "rfid-garment-production-line": 1,
  "rfid-fiber-optic-data-center": 2,
  "rfid-auto-manufacturing-system": 3,
  "rfid-motor-production-line": 4,
  "rfid-solar-crystal-pulling-factory": 5,
  "rfid-solar-cell-traceability": 6,
  "rfid-solar-slicing-traceability": 7,
  "rfid-solar-crystal-pulling-traceability": 8,

  // warehouse-logistics
  "rfid-agv-rgv-smart-logistics": 0,
  "rfid-auto-parts-logistics": 1,
  "rfid-forklift-logistics-port": 2,
  "rfid-warehouse-logistics-management": 3,
  "rfid-warehouse-logistics-application": 4,
  "rfid-cement-outbound-transport": 5,

  // archive-library
  "rfid-duoyun-smart-library": 0,

  // asset-inspection
  "rfid-mobile-engineering-vehicle-tools": 0,
  "rfid-power-grid-asset-lifecycle": 1,
  "wuhan-chutian-weibao-finance-escort": 2,

  // anti-counterfeit
  "rfid-pharma-anti-counterfeit": 0,
  "rfid-pork-meat-traceability": 1,

  // retail-supply-chain
  "rfid-garment-logistics-retail": 0,
  "rfid-unmanned-retail": 1,

  // smart-city
  "rfid-vehicle-management": 0,
  "smart-residential-ev-anti-theft": 1,
  "rfid-entertainment-technology": 2,
  "rfid-vehicle-positioning-speed": 3,

  // smart-cabinet
  "smart-cabinet-rfid-solution": 0,
};

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    console.log(`  Downloading: ${url}`);
    const file = fs.createWriteStream(destPath);
    https
      .get(url, (res) => {
        if (res.statusCode === 200) {
          res.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log(`  Saved: ${path.basename(destPath)}`);
            resolve(true);
          });
        } else if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlink(destPath, () => {});
          downloadImage(res.headers.location, destPath).then(resolve);
        } else {
          console.log(`  Failed: status ${res.statusCode}`);
          file.close();
          fs.unlink(destPath, () => {});
          resolve(false);
        }
      })
      .on("error", (err) => {
        console.log(`  Error: ${err.message}`);
        file.close();
        fs.unlink(destPath, () => {});
        resolve(false);
      });
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const downloadedFiles = [];

  console.log("=== Downloading Placeholder Images from Unsplash ===\n");

  // Download images for each category
  for (const [category, urls] of Object.entries(CATEGORY_IMAGES)) {
    console.log(`[${category}]`);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const filename = `${category}-${i + 1}.jpg`;
      const destPath = path.join(OUTPUT_DIR, filename);

      // Skip if already exists
      if (fs.existsSync(destPath)) {
        console.log(`  Exists: ${filename}`);
        downloadedFiles.push({ category, index: i, path: destPath, url });
        continue;
      }

      const success = await downloadImage(url, destPath);
      if (success) {
        downloadedFiles.push({ category, index: i, path: destPath, url });
      }

      // Wait a bit between downloads
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Generate mapping JSON
  const mapping = [];
  for (const [slug, index] of Object.entries(APPLICATION_IMAGE_MAP)) {
    // Find category from slug pattern
    let category = "smart-manufacturing";
    if (slug.includes("warehouse") || slug.includes("logistics") || slug.includes("forklift") || slug.includes("cement")) {
      category = "warehouse-logistics";
    } else if (slug.includes("library") || slug.includes("duoyun")) {
      category = "archive-library";
    } else if (slug.includes("asset") || slug.includes("power-grid") || slug.includes("finance") || slug.includes("engineering-vehicle")) {
      category = "asset-inspection";
    } else if (slug.includes("anti-counterfeit") || slug.includes("pharma") || slug.includes("meat") || slug.includes("traceability")) {
      category = "anti-counterfeit";
    } else if (slug.includes("retail") || slug.includes("unmanned") || slug.includes("garment-logistics")) {
      category = "retail-supply-chain";
    } else if (slug.includes("vehicle") || slug.includes("city") || slug.includes("entertainment") || slug.includes("residential")) {
      category = "smart-city";
    } else if (slug.includes("cabinet")) {
      category = "smart-cabinet";
    } else if (slug.includes("solar") || slug.includes("cnc") || slug.includes("auto") || slug.includes("fiber")) {
      category = "smart-manufacturing";
    }

    const imagePath = path.join(OUTPUT_DIR, `${category}-${index + 1}.jpg`);
    mapping.push({
      applicationSlug: slug,
      imagePath,
      category,
      imageIndex: index,
    });
  }

  const mappingPath = path.join(OUTPUT_DIR, "application-image-mapping.json");
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), "utf-8");

  console.log("\n=== Summary ===");
  console.log(`Images downloaded: ${downloadedFiles.length}`);
  console.log(`Applications mapped: ${mapping.length}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Mapping file: ${mappingPath}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});