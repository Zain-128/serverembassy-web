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

  // Click exactly on the 17% dropdown
  await page.mouse.click(1750, 35);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'zoom_dropdown_open.png') });

  // In the menu, "Zoom to 50%" is usually around y: 120 or similar, or let's inspect the menu text
  // Let's see what DOM elements appeared in the popup
  const menuItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*'))
      .filter(el => el.textContent && el.textContent.includes('50%') && el.children.length === 0)
      .map(el => {
        const r = el.getBoundingClientRect();
        return { text: el.textContent, x: r.x + r.width/2, y: r.y + r.height/2 };
      });
  });
  console.log('Menu items found:', JSON.stringify(menuItems));

  if (menuItems.length > 0) {
    await page.mouse.click(menuItems[0].x, menuItems[0].y);
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outDir, 'figma_at_50_pct.png') });
  }

  await browser.close();
}

main().catch(console.error);
