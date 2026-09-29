const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function main() {
  const outDir = path.resolve('C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch/detailed');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    defaultViewport: {
      width: 2560,
      height: 1440,
      deviceScaleFactor: 2
    },
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--start-maximized',
      '--window-size=2560,1440'
    ]
  });

  const page = await browser.newPage();
  await page.goto('https://www.figma.com/design/eZZ0IpqgpA4mhfRwhVW35G/power-line?node-id=14-2367&t=7omQDDVb1rkkOxhy-0', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  console.log('Waiting 12s for canvas...');
  await new Promise(r => setTimeout(r, 12000));

  // Focus canvas
  await page.mouse.click(1280, 720);
  await new Promise(r => setTimeout(r, 500));

  // Reset zoom to fit (Shift + 1)
  await page.keyboard.down('Shift');
  await page.keyboard.press('Digit1');
  await page.keyboard.up('Shift');
  await new Promise(r => setTimeout(r, 1000));

  // Zoom in 2 times with Ctrl + Equal
  for (let i = 0; i < 2; i++) {
    await page.keyboard.down('Control');
    await page.keyboard.press('Equal');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 500));
  }
  await new Promise(r => setTimeout(r, 1000));

  // Helper to drag/pan canvas
  async function pan(dx, dy) {
    await page.keyboard.down('Space');
    await page.mouse.move(1280, 720);
    await page.mouse.down();
    await page.mouse.move(1280 + dx, 720 + dy, { steps: 15 });
    await page.mouse.up();
    await page.keyboard.up('Space');
    await new Promise(r => setTimeout(r, 800));
  }

  // Pan right so the black artboard is centered
  await pan(500, 200);
  await page.screenshot({ path: path.join(outDir, 'black_s1_hero.png') });
  console.log('black_s1_hero.png saved');

  // Pan up (content moves down)
  await pan(0, -600);
  await page.screenshot({ path: path.join(outDir, 'black_s2_deals.png') });
  console.log('black_s2_deals.png saved');

  await pan(0, -600);
  await page.screenshot({ path: path.join(outDir, 'black_s3_features.png') });
  console.log('black_s3_features.png saved');

  await pan(0, -600);
  await page.screenshot({ path: path.join(outDir, 'black_s4_footer.png') });
  console.log('black_s4_footer.png saved');

  // Now pan left to white board
  await pan(-1000, 1800);
  await page.screenshot({ path: path.join(outDir, 'white_s1_hero.png') });
  console.log('white_s1_hero.png saved');

  await pan(0, -600);
  await page.screenshot({ path: path.join(outDir, 'white_s2_deals.png') });
  console.log('white_s2_deals.png saved');

  await pan(0, -600);
  await page.screenshot({ path: path.join(outDir, 'white_s3_features.png') });
  console.log('white_s3_features.png saved');

  await pan(0, -600);
  await page.screenshot({ path: path.join(outDir, 'white_s4_footer.png') });
  console.log('white_s4_footer.png saved');

  await browser.close();
  console.log('All slices completed successfully!');
}

main().catch(console.error);
