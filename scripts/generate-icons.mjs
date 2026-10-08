import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 implementation
function makeCrcTable() {
  let c;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  return crcTable;
}

const crcTable = makeCrcTable();
function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function createPng(width, height, getPixel) {
  const bytesPerPixel = 4;
  const scanlineLength = width * bytesPerPixel;
  const rawData = Buffer.alloc((scanlineLength + 1) * height);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = Buffer.concat([
    Buffer.from('IHDR'),
    ihdr
  ]);
  const ihdrCrc = Buffer.alloc(4);
  ihdrCrc.writeUInt32BE(crc32(ihdrChunk), 0);
  const ihdrLength = Buffer.alloc(4);
  ihdrLength.writeUInt32BE(13, 0);

  // IDAT chunk
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(compressed.length, 0);
  const idatType = Buffer.from('IDAT');
  const idatDataAndType = Buffer.concat([idatType, compressed]);
  const idatCrc = Buffer.alloc(4);
  idatCrc.writeUInt32BE(crc32(idatDataAndType), 0);

  // IEND chunk
  const iendLength = Buffer.alloc(4);
  iendLength.writeUInt32BE(0, 0);
  const iendType = Buffer.from('IEND');
  const iendCrc = Buffer.alloc(4);
  iendCrc.writeUInt32BE(crc32(iendType), 0);

  return Buffer.concat([
    header,
    ihdrLength,
    ihdrChunk,
    ihdrCrc,
    idatLength,
    idatDataAndType,
    idatCrc,
    iendLength,
    iendType,
    iendCrc
  ]);
}

const publicDir = path.resolve('./public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Pixel shader for dengue icon: crimson / emerald / blue medical shield with location crosshair
function iconShader(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = (x - cx) / (w / 2);
  const dy = (y - cy) / (h / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (isMaskable) {
    // Fill full background for maskable
    // Deep navy background with slight gradient
    const bgR = Math.round(15 + 10 * (1 - dy));
    const bgG = Math.round(23 + 15 * (1 - dy));
    const bgB = Math.round(42 + 25 * (1 - dy));
    
    // Inner badge
    if (dist < 0.68) {
      // Circle gradient: red/orange surveillance beacon
      const glow = Math.sin(dist * 3.14);
      return [
        Math.min(255, Math.round(225 + glow * 30)),
        Math.min(255, Math.round(40 + glow * 50)),
        Math.min(255, Math.round(60 + glow * 20)),
        255
      ];
    }
    // Target rings
    if (dist > 0.72 && dist < 0.76) {
      return [239, 68, 68, 255];
    }
    if (dist > 0.82 && dist < 0.84) {
      return [248, 113, 113, 180];
    }
    return [bgR, bgG, bgB, 255];
  }

  // Regular icon with transparent outer corner or rounded squircle
  if (dist > 0.95) {
    return [0, 0, 0, 0];
  }
  
  // Outer border
  if (dist > 0.90) {
    return [220, 38, 38, 255];
  }

  // Gradient body
  const r = Math.round(15 + (1 - dist) * 20);
  const g = Math.round(23 + (1 - dist) * 30);
  const b = Math.round(42 + (1 - dist) * 50);

  // Crosshair / target in center
  if (dist < 0.55) {
    // Inner vibrant alert circle
    return [239, 68, 68, 255];
  }
  if (dist < 0.65) {
    return [254, 202, 202, 255];
  }

  return [r, g, b, 255];
}

console.log('Generating PNG icons...');
const png192 = createPng(192, 192, (x, y, w, h) => iconShader(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

const png512 = createPng(512, 512, (x, y, w, h) => iconShader(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

const pngMaskable = createPng(512, 512, (x, y, w, h) => iconShader(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable);

const appleTouch = createPng(180, 180, (x, y, w, h) => iconShader(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);

// Create SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#0f172a"/>
  <circle cx="256" cy="256" r="180" fill="none" stroke="#ef4444" stroke-width="12" stroke-dasharray="8 8" opacity="0.6"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="#ef4444" stroke-width="16" opacity="0.8"/>
  <circle cx="256" cy="256" r="100" fill="#dc2626"/>
  <circle cx="256" cy="256" r="40" fill="#ffffff"/>
  <line x1="256" y1="60" x2="256" y2="452" stroke="#fca5a5" stroke-width="6" stroke-dasharray="12 12"/>
  <line x1="60" y1="256" x2="452" y2="256" stroke="#fca5a5" stroke-width="6" stroke-dasharray="12 12"/>
  <circle cx="256" cy="256" r="16" fill="#dc2626"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png192);

console.log('Icons generated successfully!');
