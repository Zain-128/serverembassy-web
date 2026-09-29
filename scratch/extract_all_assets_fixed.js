const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const figmaPartsDir = 'C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch/figma_parts';
const outputDir = path.join(__dirname, '../public/images/home');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function safeExtract(srcPath, extractOpts, destPath) {
  const meta = await sharp(srcPath).metadata();
  const left = Math.max(0, Math.min(extractOpts.left, meta.width - 1));
  const top = Math.max(0, Math.min(extractOpts.top, meta.height - 1));
  const width = Math.min(extractOpts.width, meta.width - left);
  const height = Math.min(extractOpts.height, meta.height - top);
  await sharp(srcPath)
    .extract({ left, top, width, height })
    .toFile(destPath);
  console.log(`Saved ${path.basename(destPath)} (${width}x${height})`);
}

async function extract() {
  console.log('Extracting assets cleanly...');

  // 1. Categories from test_categories_row.png (or from 08_black_features_categories.png)
  const catCards = [
    { name: 'category-accessories.png', x: 44, y: 184, w: 382, h: 382 },
    { name: 'category-phone-cases.png', x: 504, y: 184, w: 382, h: 382 },
    { name: 'category-phone-glasses.png', x: 964, y: 184, w: 382, h: 382 },
    { name: 'category-headphones.png', x: 1424, y: 184, w: 382, h: 382 },
    { name: 'category-mobile-phones.png', x: 1884, y: 184, w: 382, h: 382 },
    { name: 'category-chargers.png', x: 2344, y: 184, w: 382, h: 382 },
  ];

  for (const c of catCards) {
    await safeExtract(
      path.join(__dirname, 'test_categories_row.png'),
      { left: c.x, top: c.y, width: c.w, height: c.h },
      path.join(outputDir, c.name)
    );
  }

  // 2. Latest Deals from 06_black_header_hero.png
  // In 06_black_header_hero.png:
  // Deals row cards are around top: 410, height: 420
  // Card spacing ~ 460px
  const dealCards = [
    { name: 'deal-speakers.png', x: 120, y: 410, w: 410, h: 410 },
    { name: 'deal-hdd.png', x: 580, y: 410, w: 410, h: 410 },
    { name: 'deal-psu.png', x: 1040, y: 410, w: 410, h: 410 },
    { name: 'deal-network-1.png', x: 1500, y: 410, w: 410, h: 410 },
    { name: 'deal-powerline.png', x: 1960, y: 410, w: 410, h: 410 },
    { name: 'deal-network-2.png', x: 2420, y: 410, w: 410, h: 410 },
  ];

  for (const d of dealCards) {
    await safeExtract(
      path.join(figmaPartsDir, '06_black_header_hero.png'),
      { left: d.x, top: d.y, width: d.w, height: d.h },
      path.join(outputDir, d.name)
    );
  }

  // 3. PC Towers Banner:
  // In 06_black_header_hero.png:
  // The 4 PC towers are at left: 1490, top: 1140, width: 1370, height: 660
  await safeExtract(
    path.join(figmaPartsDir, '06_black_header_hero.png'),
    { left: 1490, top: 1140, width: 1370, height: 660 },
    path.join(outputDir, 'pc-towers-banner.png')
  );

  // 4. Feature Products from test_features_row.png:
  await safeExtract(
    path.join(__dirname, 'test_features_row.png'),
    { left: 30, top: 118, width: 575, height: 575 },
    path.join(outputDir, 'feature-gpu-evga.png')
  );

  await safeExtract(
    path.join(__dirname, 'test_features_row.png'),
    { left: 1420, top: 118, width: 575, height: 575 },
    path.join(outputDir, 'feature-gpu-rog.png')
  );

  await safeExtract(
    path.join(__dirname, 'test_features_row.png'),
    { left: 2115, top: 118, width: 575, height: 575 },
    path.join(outputDir, 'feature-gpu-zotac.png')
  );

  // 5. Promo pair from test_promo_pair.png:
  await safeExtract(
    path.join(__dirname, 'test_promo_pair.png'),
    { left: 960, top: 380, width: 330, height: 380 },
    path.join(outputDir, 'promo-printer.png')
  );

  await safeExtract(
    path.join(__dirname, 'test_promo_pair.png'),
    { left: 2360, top: 440, width: 440, height: 320 },
    path.join(outputDir, 'promo-speakers.png')
  );

  // 6. News images from test_news_row.png:
  await safeExtract(
    path.join(__dirname, 'test_news_row.png'),
    { left: 50, top: 160, width: 820, height: 580 },
    path.join(outputDir, 'news-circuit.png')
  );

  await safeExtract(
    path.join(__dirname, 'test_news_row.png'),
    { left: 950, top: 160, width: 820, height: 580 },
    path.join(outputDir, 'news-table.png')
  );

  await safeExtract(
    path.join(__dirname, 'test_news_row.png'),
    { left: 1850, top: 160, width: 820, height: 580 },
    path.join(outputDir, 'news-motherboard.png')
  );

  // 7. Hero left and right elements:
  // In 03_white_header.png:
  // Left tower: left: 100, top: 0, width: 800, height: 490
  // Headset: left: 2200, top: 0, width: 650, height: 490
  await safeExtract(
    path.join(figmaPartsDir, '03_white_header.png'),
    { left: 100, top: 0, width: 750, height: 490 },
    path.join(outputDir, 'hero-left-tower.png')
  );

  await safeExtract(
    path.join(figmaPartsDir, '03_white_header.png'),
    { left: 2200, top: 0, width: 700, height: 490 },
    path.join(outputDir, 'hero-right-headset.png')
  );

  console.log('ALL ASSETS EXTRACTED SUCCESSFULLY!');
}

extract().catch(console.error);
