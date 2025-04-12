const sharp = require('sharp');
const fs = require('node:fs').promises;
const path = require('node:path');

const sizes = [16, 32, 48, 64, 128, 256];
const inputSvg = path.join(__dirname, '../src/app/favicon.svg');
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    // Ensure public directory exists
    await fs.mkdir(publicDir, { recursive: true });

    // Read the SVG file
    const svgBuffer = await fs.readFile(inputSvg);

    // Generate PNG favicons in different sizes
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
    }

    // Generate ICO file (using 16x16 and 32x32)
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon.ico'));

    console.log('Favicon generation completed successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons(); 