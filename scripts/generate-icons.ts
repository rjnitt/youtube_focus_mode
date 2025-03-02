import fs from 'fs';
import sharp from 'sharp';

const sizes = [16, 48, 128];

async function generateIcons() {
  const svgBuffer = fs.readFileSync('./public/icons/icon.svg');
  
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`./public/icons/icon${size}.png`);
  }
}

generateIcons().catch(console.error); 