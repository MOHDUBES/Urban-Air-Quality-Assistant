import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { logoMarkSvg, logoFullSvg, faviconSvg, ogImageSvg } from './assets-def.mjs';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'client', 'public');
const assetsDir = path.join(rootDir, 'client', 'src', 'assets');

// Ensure directories exist
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

/**
 * Builds a multi-resolution Windows ICO file buffer from an array of PNG buffers.
 * @param {Array<{ width: number, height: number, data: Buffer }>} images
 * @returns {Buffer}
 */
function createIco(images) {
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = images.length;
  let offset = headerSize + dirEntrySize * numImages;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.data.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset
    offset += img.data.length;
    dirEntries.push(entry);
  }

  return Buffer.concat([header, ...dirEntries, ...images.map((img) => img.data)]);
}

async function run() {
  console.log('Generating SVG assets...');

  // 1. Write SVGs
  fs.writeFileSync(path.join(publicDir, 'logo-mark.svg'), logoMarkSvg.trim(), 'utf8');
  fs.writeFileSync(path.join(assetsDir, 'logo-mark.svg'), logoMarkSvg.trim(), 'utf8');

  fs.writeFileSync(path.join(publicDir, 'logo-full.svg'), logoFullSvg.trim(), 'utf8');
  fs.writeFileSync(path.join(assetsDir, 'logo-full.svg'), logoFullSvg.trim(), 'utf8');

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg.trim(), 'utf8');

  console.log('Generating PNG and ICO binaries with sharp...');

  // 2. Generate Favicon PNGs
  const png16 = await sharp(Buffer.from(faviconSvg))
    .resize(16, 16)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);

  const png32 = await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);

  const png48 = await sharp(Buffer.from(faviconSvg))
    .resize(48, 48)
    .png({ compressionLevel: 9 })
    .toBuffer();

  // 3. Generate favicon.ico containing 16x16, 32x32, 48x48
  const icoBuffer = createIco([
    { width: 16, height: 16, data: png16 },
    { width: 32, height: 32, data: png32 },
    { width: 48, height: 48, data: png48 },
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  // 4. Apple Touch Icon (180x180)
  const appleTouch = await sharp(Buffer.from(logoMarkSvg))
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);

  // 5. PWA Icon 192x192 (with ~15% safe padding for maskable support)
  // Inner icon rendered at 154x154 and centered on 192x192 with #0B3B5A background
  const inner192 = await sharp(Buffer.from(logoMarkSvg))
    .resize(154, 154)
    .toBuffer();
  const icon192 = await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 11, g: 59, b: 90, alpha: 1 }, // #0B3B5A
    },
  })
    .composite([{ input: inner192, top: 19, left: 19 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);

  // 6. PWA Icon 512x512 (with ~15% safe padding for maskable support)
  const inner512 = await sharp(Buffer.from(logoMarkSvg))
    .resize(410, 410)
    .toBuffer();
  const icon512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 11, g: 59, b: 90, alpha: 1 }, // #0B3B5A
    },
  })
    .composite([{ input: inner512, top: 51, left: 51 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);

  // 7. Open Graph Preview (1200x630)
  const ogImage = await sharp(Buffer.from(ogImageSvg))
    .resize(1200, 630)
    .png({ compressionLevel: 8 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogImage);

  // 8. Site Webmanifest
  const manifest = {
    name: 'Urban Air Quality Assistant',
    short_name: 'AirAssist',
    description: 'GenAI smog defense and urban clean air assistant for families and communities.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#0F766E',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  console.log('\n--- Asset Generation Complete ---');
  let totalBytes = 0;
  const listFiles = (dir) => {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isFile()) {
        totalBytes += stat.size;
        console.log(`  ${path.relative(rootDir, full)} : ${(stat.size / 1024).toFixed(2)} KB`);
      }
    }
  };

  console.log('client/public assets:');
  listFiles(publicDir);
  console.log('client/src/assets:');
  listFiles(assetsDir);
  console.log(`\nTotal new assets size: ${(totalBytes / 1024).toFixed(2)} KB (budget: < 300 KB)`);
}

run().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
