/**
 * Update application images with exact slug-to-image mapping
 */

const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", ".tmp", "data.db");

// Exact slug to image URL mapping from scraped data
const SLUG_IMAGE_MAP = {
  // smart-manufacturing (9 apps)
  "rfid-cnc-tool-management": "https://pmtdb1c40-pic17.websiteonline.cn/upload/4.webp",
  "rfid-solar-cell-traceability": "https://pmtdb1c40-pic17.websiteonline.cn/upload/80922EBD328A8CDB43DE7D7876BEB84D.jpg",
  "rfid-solar-slicing-traceability": "https://pmtdb1c40-pic17.websiteonline.cn/upload/vjw6.PNG",
  "rfid-solar-crystal-pulling-traceability": "https://pmtdb1c40-pic17.websiteonline.cn/upload/222.PNG",
  "rfid-solar-crystal-pulling-factory": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1_4ref.jpg",
  "rfid-auto-manufacturing-system": null, // placeholder in original
  "rfid-motor-production-line": null, // placeholder in original
  "rfid-garment-production-line": null, // placeholder in original
  "rfid-fiber-optic-data-center": "https://pmtdb1c40-pic17.websiteonline.cn/upload/5.webp",

  // warehouse-logistics (6 apps)
  "rfid-agv-rgv-smart-logistics": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1_izn0.webp",
  "rfid-auto-parts-logistics": "https://pmtdb1c40-pic17.websiteonline.cn/upload/2yt2.PNG",
  "rfid-forklift-logistics-port": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ehv8.png",
  "rfid-warehouse-logistics-management": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1458549141_73l4.jpg",
  "rfid-warehouse-logistics-application": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1466391093_kv2y.jpg",
  "rfid-cement-outbound-transport": null, // placeholder in original (was mapped to warehouse)

  // archive-library (1 app)
  "rfid-duoyun-smart-library": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1_5oov_u61r.jpg",

  // asset-inspection (3 apps)
  "rfid-mobile-engineering-vehicle-tools": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1458626292_rn45.jpg",
  "rfid-power-grid-asset-lifecycle": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1462331058_2fzb.jpg",
  "wuhan-chutian-weibao-finance-escort": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1_12wd.jpg",

  // anti-counterfeit (2 apps)
  "rfid-pharma-anti-counterfeit": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1458626852_t4wf.jpg",
  "rfid-pork-meat-traceability": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1458627499_r3kh.jpg",

  // retail-supply-chain (2 apps)
  "rfid-unmanned-retail": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1_dfym_3f0c.jpg",
  "rfid-garment-logistics-retail": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1458614250_kwa3.jpg",

  // smart-city (4 apps)
  "rfid-entertainment-technology": "https://pmtdb1c40-pic17.websiteonline.cn/upload/jucg.png",
  "rfid-vehicle-positioning-speed": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1460711922_psrd.jpg",
  "smart-residential-ev-anti-theft": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1458553270_zi98.jpg",
  "rfid-vehicle-management": "https://pmtdb1c40-pic17.websiteonline.cn/upload/1458616993_cf3o.jpg",

  // smart-cabinet (1 app) - no image in original, use placeholder
  "smart-cabinet-rfid-solution": null,
};

const db = new Database(DB_PATH);

console.log("=== Updating Application Images with Exact Mapping ===\n");

// Get all apps
const apps = db.prepare("SELECT id, name, slug FROM applications WHERE published_at IS NOT NULL AND locale = 'zh'").all();

let updated = 0;
let skipped = 0;

for (const app of apps) {
  const imageUrl = SLUG_IMAGE_MAP[app.slug];

  if (!imageUrl) {
    // No external image, keep existing or use category placeholder
    console.log(`Skip: ${app.name} (no external image)`);
    skipped++;
    continue;
  }

  // Get existing file
  const existing = db.prepare(`
    SELECT f.id FROM files f
    JOIN files_related_mph fr ON f.id = fr.file_id
    WHERE fr.related_id = ? AND fr.field = 'images' AND fr.related_type = 'api::application.application'
    LIMIT 1
  `).get(app.id);

  if (existing) {
    // Update URL
    db.prepare("UPDATE files SET url = ?, provider = 'external' WHERE id = ?").run(imageUrl, existing.id);
    console.log(`OK: ${app.slug} -> ${imageUrl}`);
    updated++;
  } else {
    // Insert new file
    const result = db.prepare(`
      INSERT INTO files (name, alternative_text, width, height, formats, hash, ext, mime, size, url, provider, folder_path, created_at, updated_at)
      VALUES (?, ?, 800, 450, '{}', ?, '.jpg', 'image/jpeg', 0, ?, 'external', '/', datetime('now'), datetime('now'))
    `).run(
      imageUrl.split("/").pop().slice(0, 50),
      app.name.slice(0, 100),
      Math.random().toString(36).substring(2, 8),
      imageUrl
    );

    db.prepare(`
      INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
      VALUES (?, ?, 'api::application.application', 'images', 0)
    `).run(result.lastInsertRowid, app.id);

    console.log(`ADD: ${app.slug} -> ${imageUrl}`);
    updated++;
  }
}

db.close();

console.log("\n=== Summary ===");
console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped}`);