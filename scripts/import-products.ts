import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_EMAIL = '1034942735@qq.com';
const ADMIN_PASSWORD = 'Fnadmin123';

// Category mapping
const CATEGORIES = [
  { name: '高频系列RFID读写器', slug: 'hf-rfid-readers', frequency: 'HF' },
  { name: '超高频系列RFID读写器', slug: 'uhf-rfid-readers', frequency: 'UHF' },
  { name: '多功能手持终端', slug: 'handheld-terminals', type: 'handheld' },
  { name: '多功能工业平板', slug: 'industrial-tablets', type: 'tablet' },
  { name: '便携式RFID读写器', slug: 'portable-readers', type: 'portable' },
];

// Products parsed from product-images.md
const PRODUCTS = [
  // 高频系列RFID读写器
  { name: 'D1338T 工业级高频网口读写器', categorySlug: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_p6nq.jpg' },
  { name: 'D1609 & D1339系列工业级高频读写器', categorySlug: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/2_yhtq.jpg' },
  { name: 'D1612 工业级高频读写器', categorySlug: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/3_nuqm.jpg' },
  { name: 'D1621系列 IO-LINK高频RFID读写器', categorySlug: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/3_nuqm.jpg' },
  { name: 'D1646T ModbusTCP 工业齐平式高频RFID读写器', categorySlug: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/4_3ji7.jpg' },
  { name: 'D1606 系列高频工业读写器', categorySlug: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/8897.png' },
  { name: 'D1604 系列工业级高频读写器', categorySlug: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D1604-1_o803.jpg' },
  { name: 'D1333系列工业级高频读写器', categorySlug: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_1alu.webp' },
  { name: 'D1626系列IO-LINK高频RFID读写器', categorySlug: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/2.webp' },
  // 超高频系列RFID读写器
  { name: 'D2184B 高性能四通道UHF读写器', categorySlug: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2184B_x6b5.jpg' },
  { name: 'D2480系列 工业超高频RFID读写器', categorySlug: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2480B_4f8u.jpg' },
  { name: 'D2381 工业级超高频读写器', categorySlug: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D1108WD2381(3)_lunh.jpg' },
  { name: 'D2188BL超高频多通道读写器', categorySlug: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2188.jpg' },
  { name: 'D2184BL超高频多通道读写器', categorySlug: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2188BL.jpg' },
  { name: 'D2181B Lite 超高频读写器', categorySlug: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2181Blite.jpg' },
  { name: 'D2184B Lite超高频读写器', categorySlug: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2184Blite_6cwb.jpg' },
  { name: 'D2181R工业级超高频读写器', categorySlug: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2181R.jpg' },
  { name: 'D2180U超高频桌面读写器', categorySlug: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2180U.jpg' },
  // 多功能手持终端
  { name: 'M12 安卓手持终端', categorySlug: 'handheld-terminals', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_7bkj.jpg' },
  { name: 'M11 工业级手持终端', categorySlug: 'handheld-terminals', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/M11_lnf7.jpg' },
  { name: 'N60 智能打印手持终端', categorySlug: 'handheld-terminals', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/11_vljy.jpg' },
  { name: 'M11高工业级安卓条码手持终端', categorySlug: 'handheld-terminals', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/M11.png' },
  // 多功能工业平板
  { name: 'P01 多功能工业平板', categorySlug: 'industrial-tablets', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_hd05.jpg' },
  // 便携式RFID读写器
  { name: 'T01 蓝牙UHF扫描仪', categorySlug: 'portable-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_xz3s_ou59.jpg' },
  { name: 'T02 蓝牙UHF扫描仪', categorySlug: 'portable-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_jxgj_0wo1.jpg' },
  { name: 'T03 蓝牙UHF扫描仪', categorySlug: 'portable-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/t03.png' },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location!).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function login(): Promise<string> {
  console.log('Logging in as admin...');
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!data.data?.token) {
    console.error('Login failed:', JSON.stringify(data, null, 2));
    process.exit(1);
  }
  console.log('Logged in successfully.');
  return data.data.token;
}

async function findOrCreateCategory(token: string, slug: string, name: string): Promise<number> {
  // Check if category exists
  const res = await fetch(`${STRAPI_URL}/api/product-categories?filters[slug][$eq]=${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.data?.length > 0) {
    console.log(`  Category exists: ${name}`);
    return data.data[0].id;
  }

  // Create category
  const createRes = await fetch(`${STRAPI_URL}/api/product-categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        name,
        slug,
        locale: 'en',
      },
    }),
  });
  const createData = await createRes.json();
  console.log(`  Created category: ${name} (id: ${createData.data.id})`);
  return createData.data.id;
}

async function uploadImage(token: string, buffer: Buffer, filename: string): Promise<number> {
  const FormData = (await import('form-data')).default;
  const form = new FormData();
  form.append('files', buffer, { filename });

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  const data = await res.json();
  if (!data[0]?.id) {
    throw new Error(`Image upload failed: ${JSON.stringify(data)}`);
  }
  return data[0].id;
}

async function createProduct(
  token: string,
  product: typeof PRODUCTS[0],
  categoryId: number,
  imageId: number | null,
): Promise<number> {
  const slug = generateSlug(product.name);
  const model = product.name.match(/^([A-Z0-9]+)/)?.[1] || '';

  const res = await fetch(`${STRAPI_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        name: product.name,
        slug,
        description: `${product.name}\n\n工业级${model || 'RFID'}设备，适用于工业自动化场景。`,
        category: categoryId,
        ...(imageId ? { images: [imageId] } : {}),
        locale: 'en',
      },
    }),
  });
  const data = await res.json();
  if (!data.data?.id) {
    console.error(`  Failed to create product ${product.name}:`, JSON.stringify(data, null, 2));
    return -1;
  }
  return data.data.id;
}

async function main() {
  const token = await login();

  // Step 1: Ensure categories exist
  console.log('\n--- Step 1: Creating/finding categories ---');
  const categoryMap = new Map<string, number>();
  for (const cat of CATEGORIES) {
    const id = await findOrCreateCategory(token, cat.slug, cat.name);
    categoryMap.set(cat.slug, id);
  }

  // Step 2: Create products with images
  console.log('\n--- Step 2: Creating products ---');
  let created = 0;
  let failed = 0;

  for (let i = 0; i < PRODUCTS.length; i++) {
    const product = PRODUCTS[i];
    const catId = categoryMap.get(product.categorySlug)!;

    console.log(`\n[${i + 1}/${PRODUCTS.length}] ${product.name}`);

    // Download image
    let imageId: number | null = null;
    try {
      const filename = product.imageUrl.split('/').pop() || 'image.jpg';
      console.log(`  Downloading ${filename}...`);
      const buffer = await downloadImage(product.imageUrl);
      imageId = await uploadImage(token, buffer, filename);
      console.log(`  Image uploaded (id: ${imageId})`);
    } catch (err: any) {
      console.log(`  Image download failed: ${err.message}`);
    }

    // Create product
    const productId = await createProduct(token, product, catId, imageId);
    if (productId > 0) {
      console.log(`  Product created (id: ${productId})`);
      created++;
    } else {
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n--- Summary ---`);
  console.log(`Created: ${created}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${PRODUCTS.length}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
