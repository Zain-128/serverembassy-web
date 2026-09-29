const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const figmaPartsDir = 'C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch/figma_parts';
const outputDir = path.join(__dirname, '../public/images/home');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Let's create an extraction script that crops each asset cleanly.
async function extractAll() {
  console.log('Extracting assets...');

  // 1. Categories from 08_black_features_categories.png or 05_white_news_footer.png
  // In 08_black_features_categories.png:
  // Let's find coordinates of the 6 category items:
  // In 08_black_features_categories.png (3840x2160):
  // Let's inspect the cards row.
  
  // Let's first save a slice of the categories area to verify
  await sharp(path.join(figmaPartsDir, '08_black_features_categories.png'))
    .extract({ left: 100, top: 120, width: 2800, height: 750 })
    .toFile(path.join(__dirname, 'test_categories_row.png'));
    
  // Also slice the Latest Deals row from 06_black_header_hero.png
  await sharp(path.join(figmaPartsDir, '06_black_header_hero.png'))
    .extract({ left: 100, top: 100, width: 2800, height: 700 })
    .toFile(path.join(__dirname, 'test_deals_row.png'));

  // Also slice the 4 PC cases banner from 06_black_header_hero.png
  await sharp(path.join(figmaPartsDir, '06_black_header_hero.png'))
    .extract({ left: 100, top: 1000, width: 2800, height: 800 })
    .toFile(path.join(__dirname, 'test_banner_row.png'));

  // Also slice Feature Products from 07_black_deals_banner.png
  await sharp(path.join(figmaPartsDir, '07_black_deals_banner.png'))
    .extract({ left: 100, top: 500, width: 2800, height: 800 })
    .toFile(path.join(__dirname, 'test_features_row.png'));

  // Also slice News from 09_black_news_footer.png
  await sharp(path.join(figmaPartsDir, '09_black_news_footer.png'))
    .extract({ left: 100, top: 200, width: 2800, height: 800 })
    .toFile(path.join(__dirname, 'test_news_row.png'));

  console.log('Saved test slices.');
}

extractAll().catch(console.error);
