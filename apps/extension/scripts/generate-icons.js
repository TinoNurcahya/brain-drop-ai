/**
 * BrainDrop AI — Pure Node.js PNG Icon Generator
 * Generates official 16x16, 48x48, and 128x128 extension icons without external native dependencies.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Simple CRC32 implementation for PNG chunks
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const body = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, body, crcBuf]);
}

function generatePng(size) {
  const width = size;
  const height = size;

  // Raw uncompressed scanline data: (1 filter byte + width * 4 RGBA bytes) per row
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        // Anti-aliased outer edge
        const edgeAlpha = Math.min(1, Math.max(0, radius - dist + 0.8));

        // Deep Navy / Obsidian Background with Cyan & Indigo Glow
        const normY = y / height;
        const normX = x / width;

        // Gradient: Cyan (#38bdf8) to Indigo (#818cf8) to Violet (#c084fc)
        const r = Math.round(14 + normX * 42 + normY * 120);
        const g = Math.round(18 + (1 - normY) * 140);
        const b = Math.round(36 + normX * 180 + normY * 50);

        // Inner glowing core representing brain neural node
        const coreDist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        let finalR = r;
        let finalG = g;
        let finalB = b;

        if (coreDist < radius * 0.55) {
          finalR = Math.min(255, finalR + 90);
          finalG = Math.min(255, finalG + 140);
          finalB = Math.min(255, finalB + 190);
        }

        rawData[pixelOffset] = finalR; // Red
        rawData[pixelOffset + 1] = finalG; // Green
        rawData[pixelOffset + 2] = finalB; // Blue
        rawData[pixelOffset + 3] = Math.round(255 * edgeAlpha); // Alpha
      } else {
        // Transparent outside
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
      }
    }
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA (6)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = createChunk("IHDR", ihdr);

  // IDAT Chunk (zlib compressed scanlines)
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk("IDAT", compressedData);

  // IEND Chunk
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function main() {
  const iconsDir = path.resolve(__dirname, "../icons");
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const sizes = [16, 48, 128];
  sizes.forEach((size) => {
    const pngBuffer = generatePng(size);
    const dest = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(dest, pngBuffer);
    console.log(`[PNG Icon] Generated: icon${size}.png (${pngBuffer.length} bytes)`);
  });

  console.log("All official Chrome Extension icons generated successfully!");
}

main();
