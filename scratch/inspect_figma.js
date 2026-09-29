const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/Osama - O16 Labs/.gemini/antigravity-ide/brain/895d713a-f7b0-42a6-af47-0372bc464caf/scratch/figma_parts';

async function main() {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.endsWith('.png')) {
      const p = path.join(dir, f);
      const meta = await sharp(p).metadata();
      console.log(`${f}: width=${meta.width}, height=${meta.height}, channels=${meta.channels}`);
    }
  }
}
main();
