// Gift images ko Pixabay se download karke apne project (public/images/gifts) mein save karta hai
// aur gifts ka naya data src/data/gifts.local.js mein likhta hai.
//
// Chalane ka tareeqa (FYP folder ki root se):
//   PowerShell:  $env:PIXABAY_KEY="apni_key"; node scripts/localizeImages.mjs
//   CMD:         set PIXABAY_KEY=apni_key && node scripts/localizeImages.mjs
//
// Script resumable hai: jo images download ho chuki hain unhe dobara nahi laata.

import fs from "fs/promises";
import path from "path";
import gifts from "../src/data/gifts.js";

const KEY = process.env.PIXABAY_KEY;
// Image wali field ka naam khud dhoondta hai (image / img / imageUrl ...)
const IMAGE_FIELD = ["image", "img", "imageUrl", "image_url", "thumbnail", "photo", "picture"].find(
  (key) => key in (gifts[0] || {}),
);

if (!IMAGE_FIELD) {
  console.error("Image wali field nahi mili. gifts[0] ki fields:", Object.keys(gifts[0] || {}));
  console.error("Script mein IMAGE_FIELD ko apni field ke naam par set karo.");
  process.exit(1);
}
const OUT_DIR = path.resolve("public/images/gifts");
const OUT_FILE = path.resolve("src/data/gifts.local.js");
const DELAY_MS = 800; // Pixabay limit ~100 requests/minute

if (!KEY) {
  console.error("PIXABAY_KEY set nahi hai. Upar comment mein tareeqa dekho.");
  process.exit(1);
}

await fs.mkdir(OUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function searchImage(query) {
  const url =
    `https://pixabay.com/api/?key=${KEY}` +
    `&q=${encodeURIComponent(query.slice(0, 100))}` +
    `&image_type=photo&safesearch=true&per_page=5`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Pixabay API error ${response.status}`);

  const data = await response.json();
  return data.hits?.[0]?.webformatURL ?? null;
}

// Pehle poora naam, phir aakhri 2 alfaaz, phir category se dhoondo
async function findImageUrl(gift) {
  const words = String(gift.name || "").split(/\s+/).filter(Boolean);
  const queries = [
    gift.name,
    words.slice(-2).join(" "),
    `${gift.category || ""} gift`,
  ].filter(Boolean);

  for (const query of queries) {
    const found = await searchImage(query);
    await sleep(DELAY_MS);
    if (found) return found;
  }

  return null;
}

const result = [];
let downloaded = 0;
let skipped = 0;
let failed = 0;

for (const [index, gift] of gifts.entries()) {
  const fileName = `${gift.id ?? index + 1}.jpg`;
  const filePath = path.join(OUT_DIR, fileName);
  const publicPath = `/images/gifts/${fileName}`;

  try {
    if (await exists(filePath)) {
      skipped++;
      result.push({ ...gift, [IMAGE_FIELD]: publicPath });
      continue;
    }

    const imageUrl = await findImageUrl(gift);
    if (!imageUrl) throw new Error("koi image nahi mili");

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`download error ${imageResponse.status}`);

    await fs.writeFile(filePath, Buffer.from(await imageResponse.arrayBuffer()));

    downloaded++;
    result.push({ ...gift, [IMAGE_FIELD]: publicPath });
    console.log(`[${index + 1}/${gifts.length}] OK   ${gift.name}`);
  } catch (error) {
    failed++;
    result.push(gift); // purani image rehne do
    console.log(`[${index + 1}/${gifts.length}] FAIL ${gift.name} -> ${error.message}`);
  }
}

await fs.writeFile(
  OUT_FILE,
  `const gifts = ${JSON.stringify(result, null, 2)};\n\nexport default gifts;\n`,
);

console.log(`\nKhatam. Downloaded: ${downloaded}, pehle se mojood: ${skipped}, fail: ${failed}`);
console.log(`Naya data: ${OUT_FILE}`);
