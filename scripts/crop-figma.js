const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function main() {
  const scratchDir = path.resolve('C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch');
  const cropDir = path.join(scratchDir, 'crops');
  if (!fs.existsSync(cropDir)) fs.mkdirSync(cropDir, { recursive: true });

  const figmaFitPath = path.join(scratchDir, 'figma_fit.png');
  const imageBase64 = fs.readFileSync(figmaFitPath).toString('base64');
  const dataUrl = `data:image/png;base64,${imageBase64}`;

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 3840, height: 2160 });

  await page.evaluate((dataUrl) => {
    return new Promise((resolve) => {
      window.img = new Image();
      window.img.onload = () => resolve();
      window.img.src = dataUrl;
    });
  }, dataUrl);

  // Black frame coordinates in 3840x2160:
  // Roughly: x: 1150 to 1640 (width ~460), y: 310 to 1830 (height ~1520)
  // White frame coordinates:
  // Roughly: x: 1680 to 2160 (width ~460), y: 310 to 1830 (height ~1520)

  // Let's create a function to crop any (x, y, w, h)
  async function crop(x, y, w, h, filename) {
    const data = await page.evaluate((x, y, w, h) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(window.img, x, y, w, h, 0, 0, w, h);
      return canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
    }, x, y, w, h);
    fs.writeFileSync(path.join(cropDir, filename), Buffer.from(data, 'base64'));
    console.log(`Saved ${filename}`);
  }

  // Let's crop full black board and full white board
  // Let's find exact coordinates by cropping full column
  await crop(1100, 280, 520, 1600, 'board_black_full.png');
  await crop(1640, 280, 520, 1600, 'board_white_full.png');

  // Let's also crop sections for detailed reading:
  // 1. Black Hero + Nav
  await crop(1100, 280, 520, 450, 'black_1_hero.png');
  // 2. Black Deals + Promos
  await crop(1100, 680, 520, 400, 'black_2_deals.png');
  // 3. Black Feature Products + Categories
  await crop(1100, 1050, 520, 450, 'black_3_features.png');
  // 4. Black Reviews + News + Footer
  await crop(1100, 1450, 520, 450, 'black_4_footer.png');

  // 1. White Hero + Nav
  await crop(1640, 280, 520, 450, 'white_1_hero.png');
  // 2. White Deals + Promos
  await crop(1640, 680, 520, 400, 'white_2_deals.png');
  // 3. White Feature Products + Categories
  await crop(1640, 1050, 520, 450, 'white_3_features.png');
  // 4. White Reviews + News + Footer
  await crop(1640, 1450, 520, 450, 'white_4_footer.png');

  await browser.close();
  console.log('All crops generated!');
}

main().catch(console.error);
