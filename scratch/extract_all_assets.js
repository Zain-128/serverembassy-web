const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const figmaPartsDir = 'C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch/figma_parts';
const outputDir = path.join(__dirname, '../public/images/home');

async function extract() {
  console.log('Extracting assets accurately...');

  // 1. Categories from test_categories_row.png (or directly from 08_black_features_categories.png at left: 100, top: 120)
  // Let's check card locations in test_categories_row.png (width=2800, height=750):
  // In test_categories_row:
  // Card 1: x ~ 43, y ~ 180, w ~ 380, h ~ 380
  // Let's extract each of the 6 category squares with white bg or transparent:
  const catCards = [
    { name: 'category-accessories.png', x: 44, y: 184, w: 382, h: 382 },
    { name: 'category-phone-cases.png', x: 504, y: 184, w: 382, h: 382 },
    { name: 'category-phone-glasses.png', x: 964, y: 184, w: 382, h: 382 },
    { name: 'category-headphones.png', x: 1424, y: 184, w: 382, h: 382 },
    { name: 'category-mobile-phones.png', x: 1884, y: 184, w: 382, h: 382 },
    { name: 'category-chargers.png', x: 2344, y: 184, w: 382, h: 382 },
  ];

  for (const c of catCards) {
    await sharp(path.join(__dirname, 'test_categories_row.png'))
      .extract({ left: c.x, top: c.y, width: c.w, height: c.h })
      .toFile(path.join(outputDir, c.name));
    console.log(`Saved ${c.name}`);
  }

  // 2. Latest Deals from test_deals_row.png (or 06_black_header_hero.png)
  // In test_deals_row.png (left: 100, top: 100, w: 2800, h: 700):
  // 6 cards:
  const dealCards = [
    { name: 'deal-speakers.png', x: 20, y: 310, w: 395, h: 395 },
    { name: 'deal-hdd.png', x: 480, y: 310, w: 395, h: 395 },
    { name: 'deal-psu.png', x: 940, y: 310, w: 395, h: 395 },
    { name: 'deal-network-1.png', x: 1400, y: 310, w: 395, h: 395 },
    { name: 'deal-powerline.png', x: 1860, y: 310, w: 395, h: 395 },
    { name: 'deal-network-2.png', x: 2320, y: 310, w: 395, h: 395 },
  ];

  for (const d of dealCards) {
    await sharp(path.join(__dirname, 'test_deals_row.png'))
      .extract({ left: d.x, top: d.y, width: d.w, height: d.h })
      .toFile(path.join(outputDir, d.name));
    console.log(`Saved ${d.name}`);
  }

  // 3. PC Towers Banner:
  // In test_banner_row.png:
  // The 4 PC towers are on the right side:
  // x: 1390, y: 130, w: 1370, h: 670
  await sharp(path.join(__dirname, 'test_banner_row.png'))
    .extract({ left: 1390, top: 135, width: 1370, height: 665 })
    .toFile(path.join(outputDir, 'pc-towers-banner.png'));
  console.log('Saved pc-towers-banner.png');

  // 4. Feature Products from test_features_row.png:
  // Card 1: EVGA GPU: x ~ 30, y ~ 118, w ~ 575, h ~ 575
  // Card 3: ROG Strix GPU: x ~ 1420, y ~ 118, w ~ 575, h ~ 575
  // Card 4: ZOTAC RTX 5090 GPU: x ~ 2115, y ~ 118, w ~ 575, h ~ 575
  await sharp(path.join(__dirname, 'test_features_row.png'))
    .extract({ left: 30, top: 118, width: 575, height: 575 })
    .toFile(path.join(outputDir, 'feature-gpu-evga.png'));

  await sharp(path.join(__dirname, 'test_features_row.png'))
    .extract({ left: 1420, top: 118, width: 575, height: 575 })
    .toFile(path.join(outputDir, 'feature-gpu-rog.png'));

  await sharp(path.join(__dirname, 'test_features_row.png'))
    .extract({ left: 2115, top: 118, width: 575, height: 575 })
    .toFile(path.join(outputDir, 'feature-gpu-zotac.png'));
  console.log('Saved feature products');

  // 5. Promo pair from test_promo_pair.png:
  // Left card: Brother Laser Printer: x: 960, y: 390, w: 320, h: 360
  // Right card: Logitech 2.1 speakers: x: 2360, y: 460, w: 420, h: 290
  await sharp(path.join(__dirname, 'test_promo_pair.png'))
    .extract({ left: 960, top: 380, width: 330, height: 380 })
    .toFile(path.join(outputDir, 'promo-printer.png'));

  await sharp(path.join(__dirname, 'test_promo_pair.png'))
    .extract({ left: 2360, top: 440, width: 440, height: 320 })
    .toFile(path.join(outputDir, 'promo-speakers.png'));
  console.log('Saved promo pair');

  // 6. News images from test_news_row.png:
  // 3 images:
  // Card 1: x: 50, y: 160, w: 820, h: 580
  // Card 2: x: 950, y: 160, w: 820, h: 580
  // Card 3: x: 1850, y: 160, w: 820, h: 580
  await sharp(path.join(__dirname, 'test_news_row.png'))
    .extract({ left: 50, top: 160, width: 820, height: 580 })
    .toFile(path.join(outputDir, 'news-circuit.png'));

  await sharp(path.join(__dirname, 'test_news_row.png'))
    .extract({ left: 950, top: 160, width: 820, height: 580 })
    .toFile(path.join(outputDir, 'news-table.png'));

  await sharp(path.join(__dirname, 'test_news_row.png'))
    .extract({ left: 1850, top: 160, width: 820, height: 580 })
    .toFile(path.join(outputDir, 'news-motherboard.png'));
  console.log('Saved news images');

  console.log('All assets extracted successfully!');
}

extract().catch(console.error);
