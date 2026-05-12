/**
 * Import generated placeholder images to Strapi and link to applications
 *
 * Usage: node scripts/import-application-images.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGES_DIR = path.join(__dirname, "scraped-images");
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");
const DB_PATH = path.join(__dirname, "..", ".tmp", "data.db");

// Application slug to category mapping (from database)
const APPLICATION_CATEGORY_MAP = {
  "rfid-cnc-tool-management": "smart-manufacturing",
  "rfid-garment-production-line": "smart-manufacturing",
  "rfid-fiber-optic-data-center": "smart-manufacturing",
  "rfid-auto-manufacturing-system": "smart-manufacturing",
  "rfid-motor-production-line": "smart-manufacturing",
  "rfid-solar-crystal-pulling-factory": "smart-manufacturing",
  "rfid-solar-cell-traceability": "smart-manufacturing",
  "rfid-solar-slicing-traceability": "smart-manufacturing",
  "rfid-solar-crystal-pulling-traceability": "smart-manufacturing",
  "rfid-agv-rgv-smart-logistics": "warehouse-logistics",
  "rfid-auto-parts-logistics": "warehouse-logistics",
  "rfid-forklift-logistics-port": "warehouse-logistics",
  "rfid-warehouse-logistics-management": "warehouse-logistics",
  "rfid-warehouse-logistics-application": "warehouse-logistics",
  "rfid-cement-outbound-transport": "warehouse-logistics",
  "rfid-duoyun-smart-library": "archive-library",
  "rfid-mobile-engineering-vehicle-tools": "asset-inspection",
  "rfid-power-grid-asset-lifecycle": "asset-inspection",
  "wuhan-chutian-weibao-finance-escort": "asset-inspection",
  "rfid-pharma-anti-counterfeit": "anti-counterfeit",
  "rfid-pork-meat-traceability": "anti-counterfeit",
  "rfid-garment-logistics-retail": "retail-supply-chain",
  "rfid-unmanned-retail": "retail-supply-chain",
  "rfid-vehicle-management": "smart-city",
  "smart-residential-ev-anti-theft": "smart-city",
  "rfid-entertainment-technology": "smart-city",
  "rfid-vehicle-positioning-speed": "smart-city",
  "smart-cabinet-rfid-solution": "smart-cabinet",
};

function getSqlite3() {
  // Use better-sqlite3 if available, otherwise fallback to sqlite3 CLI
  try {
    return require("better-sqlite3");
  } catch {
    return null;
  }
}

async function uploadImageToStrapi(categoryImagePath, category) {
  // Generate unique filename
  const timestamp = Date.now();
  const hash = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(categoryImagePath);
  const filename = `${timestamp}_${hash}${ext}`;

  // Copy image to Strapi uploads folder
  const destPath = path.join(UPLOADS_DIR, filename);
  fs.copyFileSync(categoryImagePath, destPath);

  // Get image metadata
  const metadata = await sharp(destPath).metadata();

  return {
    filename,
    url: `/uploads/${filename}`,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: fs.statSync(destPath).size,
  };
}

async function main() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const sqlite3 = getSqlite3();

  if (!sqlite3) {
    console.log("Using sqlite3 CLI for database operations");
  }

  console.log("=== Importing Application Images to Strapi ===\n");

  // Read image mapping
  const mappingPath = path.join(IMAGES_DIR, "application-image-mapping.json");
  if (!fs.existsSync(mappingPath)) {
    console.error("Mapping file not found. Run generate-placeholder-images.js first.");
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));

  // Upload each category image once
  const categoryImageRecords = {};
  const categories = [...new Set(Object.values(APPLICATION_CATEGORY_MAP))];

  for (const category of categories) {
    const imagePath = path.join(IMAGES_DIR, `${category}.jpg`);
    if (!fs.existsSync(imagePath)) {
      console.log(`Skipping: ${category} (image not found)`);
      continue;
    }

    console.log(`Uploading: ${category}`);
    const fileRecord = await uploadImageToStrapi(imagePath, category);
    categoryImageRecords[category] = fileRecord;
    console.log(`  File: ${fileRecord.filename}`);
  }

  // Now update database
  // 1. Insert file records
  // 2. Link files to applications

  const fileIds = {};

  for (const [category, fileRecord] of Object.entries(categoryImageRecords)) {
    // Insert file record
    const insertSQL = `
      INSERT INTO files (name, alternative_text, caption, width, height, formats, hash, ext, mime, size, url, preview_url, provider, provider_metadata, folder_path, created_at, updated_at)
      VALUES ('${fileRecord.filename}', '${category}', '', ${fileRecord.width}, ${fileRecord.height}, '{}', '${Math.random().toString(36).substring(2, 10)}', '${fileRecord.format}', 'image/${fileRecord.format}', ${fileRecord.size}, '${fileRecord.url}', NULL, 'local', '{}', '/', datetime('now'), datetime('now'));
    `;

    if (sqlite3) {
      const db = sqlite3(DB_PATH);
      const result = db.prepare(insertSQL).run();
      fileIds[category] = result.lastInsertRowid;
      db.close();
    } else {
      // Use CLI
      const result = require("child_process").execSync(`sqlite3 "${DB_PATH}" "${insertSQL}; SELECT last_insert_rowid();"`, { encoding: "utf-8" });
      fileIds[category] = parseInt(result.trim().split("\n").pop());
    }

    console.log(`  File ID: ${fileIds[category]}`);
  }

  // Link files to applications
  console.log("\n=== Linking Images to Applications ===\n");

  for (const [slug, category] of Object.entries(APPLICATION_CATEGORY_MAP)) {
    if (!fileIds[category]) continue;

    // Find application by slug
    const findAppSQL = `SELECT id FROM applications WHERE slug = '${slug}' AND locale = 'zh' AND published_at IS NOT NULL LIMIT 1;`;

    let appId;
    if (sqlite3) {
      const db = sqlite3(DB_PATH);
      appId = db.prepare(findAppSQL).get()?.id;
      db.close();
    } else {
      const result = require("child_process").execSync(`sqlite3 "${DB_PATH}" "${findAppSQL}"`, { encoding: "utf-8" });
      appId = parseInt(result.trim()) || null;
    }

    if (!appId) {
      console.log(`Skipping: ${slug} (application not found)`);
      continue;
    }

    // Link file to application
    const linkSQL = `
      INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
      VALUES (${fileIds[category]}, ${appId}, 'api::application.application', 'images', 0);
    `;

    if (sqlite3) {
      const db = sqlite3(DB_PATH);
      db.prepare(linkSQL).run();
      db.close();
    } else {
      require("child_process").execSync(`sqlite3 "${DB_PATH}" "${linkSQL}"`, { encoding: "utf-8" });
    }

    console.log(`Linked: ${slug} -> file ${fileIds[category]}`);
  }

  console.log("\n=== Summary ===");
  console.log(`Files uploaded: ${Object.keys(fileIds).length}`);
  console.log(`Applications linked: ${Object.keys(APPLICATION_CATEGORY_MAP).length}`);
  console.log(`Uploads folder: ${UPLOADS_DIR}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});