const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function main() {
  const outDir = path.resolve('C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1200,
      deviceScaleFactor: 2
    },
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--start-maximized',
      '--window-size=1920,1200'
    ]
  });

  const page = await browser.newPage();
  await page.goto('https://www.figma.com/design/eZZ0IpqgpA4mhfRwhVW35G/power-line?node-id=14-2367&t=7omQDDVb1rkkOxhy-0', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  console.log('Waiting 12s...');
  await new Promise(r => setTimeout(r, 12000));

  // Dismiss signup modal if any (click the close button or background)
  // Let's click the zoom dropdown top-right (around x: 1720, y: 35)
  await page.mouse.click(1720, 35);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'zoom_menu.png') });

  // Let's see what keys can select frames. In Figma, pressing '/' opens quick actions search!
  // Let's type 'black' into quick actions!
  await page.keyboard.press('Slash');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.type('black');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 800));

  // Press Shift+2 (Zoom to selection)
  await page.keyboard.down('Shift');
  await page.keyboard.press('Digit2');
  await page.keyboard.up('Shift');
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(outDir, 'zoom_black_selection.png') });

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
