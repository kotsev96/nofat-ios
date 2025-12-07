const fs = require('fs');
const path = require('path');

// Создаем минимальные валидные PNG файлы
// Базовый PNG: прозрачный 1024x1024 пикселей

function createValidPNG(width, height, filename, backgroundColor = null) {
  // Минимальный валидный PNG (grayscale)
  const bytesPerPixel = 1; // grayscale
  const rowSize = width * bytesPerPixel;
  const dataSize = rowSize * height;
  
  // PNG структура
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.allocUnsafe(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 0; // color type: grayscale
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrCRC = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdrChunk = Buffer.concat([
    Buffer.allocUnsafe(4),
    Buffer.from('IHDR'),
    ihdrData,
    Buffer.allocUnsafe(4)
  ]);
  ihdrChunk.writeUInt32BE(13, 0);
  ihdrChunk.writeUInt32BE(ihdrCRC, 17);
  
  // IDAT chunk (пустые данные)
  const imageData = Buffer.alloc(height * (rowSize + 1));
  for (let y = 0; y < height; y++) {
    imageData[y * (rowSize + 1)] = 0; // filter byte
    if (backgroundColor) {
      const color = backgroundColor === '#6FCF97' ? 0x80 : 0xF0;
      imageData.fill(color, y * (rowSize + 1) + 1, (y + 1) * (rowSize + 1));
    }
  }
  
  const compressed = require('zlib').deflateSync(imageData);
  const idatCRC = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idatChunk = Buffer.concat([
    Buffer.allocUnsafe(4),
    Buffer.from('IDAT'),
    compressed,
    Buffer.allocUnsafe(4)
  ]);
  idatChunk.writeUInt32BE(compressed.length, 0);
  idatChunk.writeUInt32BE(idatCRC, 4 + 4 + compressed.length);
  
  // IEND chunk
  const iendCRC = crc32(Buffer.from('IEND'));
  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]),
    Buffer.from('IEND'),
    Buffer.allocUnsafe(4)
  ]);
  iendChunk.writeUInt32BE(iendCRC, 8);
  
  const png = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(filename, png);
  console.log(`Created: ${filename} (${width}x${height})`);
}

function crc32(data) {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[i] = crc;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Создаем файлы
createValidPNG(1024, 1024, 'icon.png', '#6FCF97');
createValidPNG(1242, 2436, 'splash.png', '#F2F2F2');
createValidPNG(1024, 1024, 'adaptive-icon.png', '#6FCF97');
createValidPNG(48, 48, 'favicon.png', '#6FCF97');

console.log('✅ All asset files created!');
