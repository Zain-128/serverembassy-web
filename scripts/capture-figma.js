const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function main() {
  const outDir = path.resolve('C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    defaultViewport: {
      width: 2560,
      height: 1440,
      deviceScaleFactor: 2
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('Navigating to Figma...');
  await page.goto('https://www.figma.com/design/eZZ0IpqgpA4mhfRwhVW35G/power-line?node-id=14-2367&t=7omQDDVb1rkkOxhy-0', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  // Wait a bit for webgl canvas to render
  console.log('Waiting for render...');
  await new Promise(r => setTimeout(r, 10000));

  await page.screenshot({ path: path.join(outDir, 'figma_overview_2x.png') });
  console.log('Overview screenshot taken');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
