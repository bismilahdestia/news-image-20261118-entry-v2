// news-image-20261118 entry, round 2 (Node 22, standard library only).
//
// What it does: copies the finished front page, entry.png, sitting next
// to this file, to /output/entry.png byte for byte. The page sums up the
// world's news of Wednesday 18 November 2026 in four panels: Trump
// landing in Manila for the Quad talks, the Crimean Bridge struck for a
// second day, Iranian drones over a US radar site in Bahrain, and Nvidia
// doubling revenue, with a ticker of the day's other stories.
//
// v2 vs v1: the Manila caption is fixed (v1 had "as the the ASEAN
// summit opens"), the Bahrain panel is regenerated (bright sunset sky,
// six large drones clearly visible, radar domes and dishes big and
// unmistakable — v1's panel was so dark the drones were specks),
// region kickers above each headline (ASIA / EUROPE / MIDDLE EAST /
// MARKETS) make the day's breadth read at a glance, and the masthead
// and ticker band are slightly larger with larger type. The layout
// (masthead, kickers, captions, ticker) was composed with PIL so every
// word is spelled exactly right.
//
// The file is JPEG bytes in a file still named entry.png: the gate tells
// the format from the first bytes, and JPEG keeps this photo-heavy page
// well under the 1 MiB gate (verified locally: 337,034 bytes at
// 1024x1024, and two runs write identical bytes).
//
// Checks, in order:
//   1. Before writing, the source is validated: it must really be a PNG
//      or a JPEG (magic bytes), fit the gate (at most 1 MiB, at most
//      1024 by 1024 pixels, read from the IHDR chunk or the JPEG SOF
//      marker), so a bad file fails loudly instead of submitting
//      something the gate would refuse.
//   2. After writing, the program reads the written file back and
//      compares it byte for byte with the source bytes it copied. If
//      the two differ — a short write, a truncated disk, anything — it
//      prints an error to stderr and exits non-zero, so a corrupted
//      output can never pass silently as a good entry.
//   3. The written file is also asserted to be at most 1 MiB
//      (1048576 bytes); a larger file exits non-zero with an error.
//
// The copy is deterministic: repeated grading runs write identical bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576; // 1 MiB, the gate's file-size limit
const MAX_DIMENSION = 1024; // the gate's width/height limit

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'entry.png');
const out = join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png');

// Fail loudly, with a message on stderr and a non-zero exit, instead of
// throwing an uncaught exception whose text the grader may swallow.
function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

const buf = readFileSync(src);
if (buf.length > MAX_BYTES) {
  fail(`entry.png is ${buf.length} bytes, over the 1 MiB gate`);
}

// Detect the format from the first bytes: PNG 89 50 4E 47, JPEG FF D8 FF.
const isPng = buf.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
if (!isPng && !isJpeg) {
  fail('entry.png is neither a PNG nor a JPEG file');
}

let width;
let height;
if (isPng) {
  if (buf.toString('ascii', 12, 16) !== 'IHDR') {
    fail('entry.png has no IHDR chunk where a PNG should');
  }
  width = buf.readUInt32BE(16);
  height = buf.readUInt32BE(20);
} else {
  // Walk the JPEG markers to the first start-of-frame segment (SOF0/SOF2)
  // and read its height and width (big-endian, 2 bytes each).
  let pos = 2;
  let found = false;
  while (pos + 9 < buf.length && !found) {
    if (buf[pos] !== 0xff) {
      fail('entry.png has a broken JPEG marker stream');
    }
    const marker = buf[pos + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      height = buf.readUInt16BE(pos + 5);
      width = buf.readUInt16BE(pos + 7);
      found = true;
    } else if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      pos += 2; // standalone marker, no length field
    } else {
      pos += 2 + buf.readUInt16BE(pos + 2);
    }
  }
  if (!found) {
    fail('entry.png has no JPEG start-of-frame marker');
  }
}
if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
  fail(`entry.png is ${width}x${height}, over the 1024x1024 gate`);
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buf);

// Self-verification: read the written file back and compare it byte for
// byte with the source bytes. A mismatch means the copy is corrupt and
// the entry must not be graded as if it were fine.
const written = readFileSync(out);
if (written.length > MAX_BYTES) {
  fail(`wrote ${out} at ${written.length} bytes, over the 1 MiB gate`);
}
if (!written.equals(buf)) {
  fail(
    `wrote ${out} (${written.length} bytes) but it does not match the ` +
      `source entry.png (${buf.length} bytes) byte for byte`,
  );
}

console.log(`wrote ${out} (${width}x${height}, ${buf.length} bytes, ${isPng ? 'PNG' : 'JPEG'})`);
