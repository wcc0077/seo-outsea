/**
 * Update application images with fuzzy name matching
 */

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const SCRAPED_FILE = path.join(__dirname, "scraped-data", "application-images-from-list.json");
const DB_PATH = path.join(__dirname, "..", ".tmp", "data.db");

// Normalize string for comparison
function normalize(s) {
  return s
    .replace(/[：:""''！!，,。.?？（）()]/g, "")  // Remove punctuation
    .replace(/\s+/g, "")                          // Remove spaces
    .replace(/上海孚恩电子科技有限公司实力护航/g, "")
    .replace(/孚恩/g, "")
    .replace(/RFID/g, "rfid")
    .toLowerCase();
}

// Check if names match (fuzzy)
function namesMatch(scrapedName, dbName) {
  const s = normalize(scrapedName);
  const d = normalize(dbName);

  // Direct match
  if (s === d) return true;

  // One contains the other
  if (s.includes(d) || d.includes(s)) return true;

  // Check if most characters match
  const minLength = Math.min(s.length, d.length);
  const commonChars = [...s].filter(c => d.includes(c)).length;
  if (commonChars >= minLength * 0.7) return true;

  // Check first 15 chars
  if (s.slice(0, 15) === d.slice(0, 15)) return true;

  return false;
}

async function main() {
  const scrapedData = JSON.parse(fs.readFileSync(SCRAPED_FILE, "utf-8"));
  const db = new Database(DB_PATH);

  console.log("=== Updating Application Images ===\n");

  // Get all published applications
  const apps = db.prepare(`
    SELECT id, name, slug FROM applications WHERE published_at IS NOT NULL AND locale = 'zh'
  `).all();

  let updated = 0;
  let skipped = 0;

  for (const [category, images] of Object.entries(scrapedData)) {
    console.log(`[${category}]`);

    for (const img of images) {
      // Skip placeholder images
      if (img.imageUrl.includes("blank.gif") || img.imageUrl.includes("static.websiteonline")) {
        console.log(`  Skip placeholder: ${img.name}`);
        skipped++;
        continue;
      }

      // Find matching application by fuzzy name match
      const matchedApp = apps.find(app => namesMatch(img.name, app.name));

      if (!matchedApp) {
        console.log(`  No match: "${img.name}"`);
        skipped++;
        continue;
      }

      // Update file URL directly
      const existingFile = db.prepare(`
        SELECT f.id, f.url
        FROM files f
        JOIN files_related_mph fr ON f.id = fr.file_id
        WHERE fr.related_id = ? AND fr.field = 'images' AND fr.related_type = 'api::application.application'
        LIMIT 1
      `).get(matchedApp.id);

      if (existingFile) {
        db.prepare(`UPDATE files SET url = ?, provider = 'external' WHERE id = ?`)
          .run(img.imageUrl, existingFile.id);
        console.log(`  OK: "${matchedApp.name}" -> ${img.imageUrl}`);
        updated++;
      } else {
        // Insert new external file
        const result = db.prepare(`
          INSERT INTO files (name, alternative_text, width, height, formats, hash, ext, mime, size, url, provider, folder_path, created_at, updated_at)
          VALUES (?, ?, 800, 450, '{}', ?, '.jpg', 'image/jpeg', 0, ?, 'external', '/', datetime('now'), datetime('now'))
        `).run(
          img.imageUrl.split("/").pop().slice(0, 50),
          img.name.slice(0, 100),
          Math.random().toString(36).substring(2, 8),
          img.imageUrl
        );

        // Link to application
        db.prepare(`
          INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
          VALUES (?, ?, 'api::application.application', 'images', 0)
        `).run(result.lastInsertRowid, matchedApp.id);

        console.log(`  ADD: "${matchedApp.name}" -> ${img.imageUrl}`);
        updated++;
      }
    }
  }

  db.close();

  console.log("\n=== Summary ===");
  console.log(`Updated/Added: ${updated}`);
  console.log(`Skipped: ${skipped}`);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});