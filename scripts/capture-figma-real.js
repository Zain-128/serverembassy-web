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
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    },
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--start-maximized',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  console.log('Navigating to Figma...');
  await page.goto('https://www.figma.com/design/eZZ0IpqgpA4mhfRwhVW35G/power-line?node-id=14-2367&t=7omQDDVb1rkkOxhy-0', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  console.log('Waiting 15 seconds for canvas to load...');
  await new Promise(r => setTimeout(r, 15000));

  await page.screenshot({ path: path.join(outDir, 'figma_initial.png') });
  console.log('figma_initial.png saved');

  // Let's click at 1500, 30 top right or zoom dropdown
  // Or press Shift + 1 to zoom to fit
  await page.keyboard.down('Shift');
  await page.keyboard.press('Digit1');
  await page.keyboard.up('Shift');
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(outDir, 'figma_fit.png') });
  console.log('figma_fit.png saved');

  // Let's zoom in on the 'black' frame (left side)
  // Let's move mouse to x: 750, y: 500 and zoom in using wheel or keyboard
  await page.mouse.move(750, 500);
  for (let i = 0; i < 5; i++) {
    await page.keyboard.down('Control');
    await page.keyboard.press('Equal');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'figma_black_top.png') });
  console.log('figma_black_top.png saved');

  // Pan down (drag canvas with Space + mouse drag or arrow keys or PageDown)
  await page.keyboard.down('Space');
  await page.mouse.move(960, 800);
  await page.mouse.down();
  await page.mouse.move(960, 200, { steps: 20 });
  await page.mouse.up();
  await page.keyboard.up('Space');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'figma_black_mid.png') });
  console.log('figma_black_mid.png saved');

  // Pan down more
  await page.keyboard.down('Space');
  await page.mouse.move(960, 800);
  await page.mouse.down();
  await page.mouse.move(960, 200, { steps: 20 });
  await page.mouse.up();
  await page.keyboard.up('Space');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'figma_black_bottom.png') });
  console.log('figma_black_bottom.png saved');

  // Now pan right to 'white' board
  await page.keyboard.down('Space');
  await page.mouse.move(1200, 500);
  await page.mouse.down();
  await page.mouse.move(300, 500, { steps: 20 });
  await page.mouse.up();
  await page.keyboard.up('Space');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'figma_white_bottom.png') });
  console.log('figma_white_bottom.png saved');

  // Pan up on 'white' board
  await page.keyboard.down('Space');
  await page.mouse.move(960, 200);
  await page.mouse.down();
  await page.mouse.move(960, 800, { steps: 20 });
  await page.mouse.up();
  await page.keyboard.up('Space');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'figma_white_top.png') });
  console.log('figma_white_top.png saved');

  await browser.close();
  console.log('Done capturing all views!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
