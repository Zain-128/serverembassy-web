const sharp = require('sharp');
const path = require('path');

const figmaPartsDir = 'C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch/figma_parts';

async function testHero() {
  // In 03_white_header.png:
  // The hero banner is between y=0 and y=500
  await sharp(path.join(figmaPartsDir, '03_white_header.png'))
    .extract({ left: 100, top: 0, width: 2800, height: 490 })
    .toFile(path.join(__dirname, 'test_hero_banner.png'));

  // Also check promo pair in 03_white_header.png:
  // Around y=1200 to 2000
  await sharp(path.join(figmaPartsDir, '03_white_header.png'))
    .extract({ left: 100, top: 1200, width: 2800, height: 800 })
    .toFile(path.join(__dirname, 'test_promo_pair.png'));

  console.log('Saved test hero and promo pair');
}

testHero().catch(console.error);
