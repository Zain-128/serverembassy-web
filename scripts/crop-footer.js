const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function main() {
  const scratchDir = path.resolve('C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch');
  const cropDir = path.join(scratchDir, 'crops');

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

  // Footer crops
  await crop(1100, 1720, 520, 230, 'black_footer_exact.png');
  await crop(1640, 1720, 520, 230, 'white_footer_exact.png');

  // Also let's crop the header exact with logo (x: 1080 to 1620, y: 310 to 450)
  await crop(1070, 310, 550, 180, 'black_header_exact.png');
  await crop(1630, 310, 550, 180, 'white_header_exact.png');

  await browser.close();
}

main().catch(console.error);
