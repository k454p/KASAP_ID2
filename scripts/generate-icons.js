import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

async function generateIcons() {
  const iconSvgPath = path.resolve('public/icon.svg');
  const maskableSvgPath = path.resolve('public/icon-maskable.svg');

  const iconBuffer = fs.readFileSync(iconSvgPath);
  const maskableBuffer = fs.readFileSync(maskableSvgPath);

  const targets = [
    { name: 'pwa-192x192.png', size: 192, buffer: iconBuffer },
    { name: 'pwa-512x512.png', size: 512, buffer: iconBuffer },
    { name: 'apple-touch-icon.png', size: 180, buffer: iconBuffer },
    { name: 'favicon.png', size: 64, buffer: iconBuffer },
    { name: 'pwa-maskable-512x512.png', size: 512, buffer: maskableBuffer },
  ];

  for (const target of targets) {
    const outPath = path.resolve('public', target.name);
    await sharp(target.buffer)
      .resize(target.size, target.size)
      .png()
      .toFile(outPath);
    console.log(`Generated ${target.name} (${target.size}x${target.size})`);
  }

  console.log('All PWA icons generated successfully via sharp!');
}

generateIcons().catch((err) => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
