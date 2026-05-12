/**
 * Generate placeholder images for applications using Sharp
 *
 * Usage: node scripts/generate-placeholder-images.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUTPUT_DIR = path.join(__dirname, "scraped-images");

// Category color schemes
const CATEGORY_COLORS = {
  "smart-manufacturing": { bg: "#1e3a5f", icon: "🏭", label: "智能智造" },
  "warehouse-logistics": { bg: "#064e3b", icon: "📦", label: "仓储物流" },
  "archive-library": { bg: "#78350f", icon: "📚", label: "档案图书" },
  "asset-inspection": { bg: "#1f2937", icon: "🛡️", label: "资产巡检" },
  "anti-counterfeit": { bg: "#14532d", icon: "✅", label: "防伪追溯" },
  "retail-supply-chain": { bg: "#881337", icon: "🛒", label: "连锁零售" },
  "smart-city": { bg: "#4c1d95", icon: "🏙️", label: "智慧城市" },
  "smart-cabinet": { bg: "#164e63", icon: "🗄️", label: "智能柜体" },
};

// Application slug to category mapping
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

// Create SVG with gradient and icon
function createPlaceholderSVG(category, width = 800, height = 450) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS["smart-manufacturing"];

  // Parse hex color to RGB for gradient
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  const bgRgb = hexToRgb(colors.bg);

  // Create gradient effect using SVG
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(${bgRgb});stop-opacity:1" />
      <stop offset="50%" style="stop-color:rgb(${Math.min(parseInt(colors.bg.slice(1, 3), 16) + 40, 255)}, ${Math.min(parseInt(colors.bg.slice(3, 5), 16) + 40, 255)}, ${Math.min(parseInt(colors.bg.slice(5, 7), 16) + 40, 255)});stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(${Math.max(parseInt(colors.bg.slice(1, 3), 16) - 20, 0)}, ${Math.max(parseInt(colors.bg.slice(3, 5), 16) - 20, 0)}, ${Math.max(parseInt(colors.bg.slice(5, 7), 16) - 20, 0)});stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
  <circle cx="${width / 2}" cy="${height / 2 - 30}" r="80" fill="rgba(255,255,255,0.1)" />
  <circle cx="${width / 2}" cy="${height / 2 - 30}" r="60" fill="rgba(255,255,255,0.15)" />
  <text x="${width / 2}" y="${height / 2 - 30}" font-family="Arial, sans-serif" font-size="100" fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="middle">${colors.icon}</text>
  <text x="${width / 2}" y="${height - 50}" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="rgba(255,255,255,0.7)" text-anchor="middle">${colors.label}</text>
</svg>`;
}

async function generateImage(category) {
  const svg = createPlaceholderSVG(category);
  const filepath = path.join(OUTPUT_DIR, `${category}.jpg`);

  await sharp(Buffer.from(svg))
    .resize(800, 450)
    .jpeg({ quality: 90 })
    .toFile(filepath);

  return filepath;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("=== Generating Placeholder Images ===\n");

  const categoryImages = {};

  for (const [category, colors] of Object.entries(CATEGORY_COLORS)) {
    console.log(`Generating: ${category}`);
    const filepath = await generateImage(category);
    categoryImages[category] = filepath;
    console.log(`  Saved: ${path.basename(filepath)}`);
  }

  // Generate mapping
  const mapping = Object.entries(APPLICATION_CATEGORY_MAP).map(([slug, category]) => ({
    applicationSlug: slug,
    category,
    imagePath: categoryImages[category],
  }));

  const mappingPath = path.join(OUTPUT_DIR, "application-image-mapping.json");
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), "utf-8");

  console.log("\n=== Summary ===");
  console.log(`Category images: ${Object.keys(categoryImages).length}`);
  console.log(`Applications mapped: ${mapping.length}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});