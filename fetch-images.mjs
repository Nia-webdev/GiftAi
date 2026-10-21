import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const KEY = process.argv[2] || process.env.PIXABAY_KEY;
if (!KEY) {
  console.error("Usage: node fetch-images.mjs <PIXABAY_API_KEY>");
  process.exit(1);
}

const GIFTS_PATH = path.resolve("src/data/gifts.js");
const BACKUP_PATH = path.resolve("src/data/gifts.backup.js");
const CACHE_PATH = path.resolve("pixabay-cache.json");

const OVERRIDES = {
  "Cake Surprise": "birthday cake",
  "Celebration Hamper": "gift hamper",
  "Gift Basket": "gift basket",
  "Party Hat Kit": "party hats",
  "Greeting Card Set": "greeting cards",
  "Party Banner": "birthday banner",
  "Cookie Tin": "cookies tin",
  "Balloon Set": "balloons",
  "Cupcake Set": "cupcakes",
  "Couple Mug Set": "couple mugs",
  "Memory Frame": "photo frame",
  "Couple Watch Set": "couple watches",
  "Love Candle": "candle",
  "Wine Glass Set": "wine glasses",
  "Love Lamp": "table lamp",
  "Couple Bracelet": "bracelet",
  "Candle Gift Set": "candles gift",
  "Couple Keychain": "keychain",
  "Perfume Set": "perfume",
  "Perfume Bottle": "perfume bottle",
  "Achievement Box": "gift box",
  "Cap Keepsake": "graduation cap",
  "Leather Planner": "planner notebook",
  "Book Lamp": "reading lamp",
  "Dinner Set": "dinnerware set",
  "Wedding Frame": "wedding photo frame",
  "Couple Candle Set": "candles",
  "Bedsheet Set": "bedding set",
  "Decorative Lantern": "lantern",
  "Red Rose Bouquet": "red roses bouquet",
  "Heart Chocolate": "heart chocolate",
  "Love Letter Box": "love letter",
  "Couple Ring Box": "ring box",
  "Heart Pendant": "heart pendant necklace",
  "Candle Set": "candles",
  "Love Photo Frame": "photo frame heart",
  "Rose Teddy": "teddy bear rose",
  "Silk Scarf": "silk scarf",
  "Spa Gift Set": "spa set",
  "Tie Set": "necktie",
  "Pen Set": "fountain pen",
  "Engraved Pen": "pen",
  "Photo T-Shirt": "t-shirt",
  "Name Keychain": "keychain",
  "Name Necklace": "necklace",
  "Printed Cushion": "cushion",
  "Father's Day|Perfume": "cologne",
};

const { default: gifts } = await import(pathToFileURL(GIFTS_PATH).href);

if (!fs.existsSync(BACKUP_PATH)) fs.copyFileSync(GIFTS_PATH, BACKUP_PATH);

const nounOf = (g) => g.name.split(" ").slice(1).join(" ");
const queryOf = (g) => {
  const noun = nounOf(g);
  return OVERRIDES[`${g.category}|${noun}`] || OVERRIDES[noun] || noun.toLowerCase();
};

const groups = new Map();
for (const g of gifts) {
  const q = queryOf(g);
  if (!groups.has(q)) groups.set(q, []);
  groups.get(q).push(g);
}
console.log(`${gifts.length} gifts, ${groups.size} different searches`);

const cache = fs.existsSync(CACHE_PATH) ? JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) : {};
const saveCache = () => fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensurePhotos(query, needed) {
  cache[query] = cache[query] || { photos: [], page: 0 };
  const entry = cache[query];
  while (entry.photos.length < needed && entry.page < 5) {
    const page = entry.page + 1;
    const url = `https://pixabay.com/api/?key=${KEY}&q=${encodeURIComponent(query)}&image_type=photo&safesearch=true&per_page=100&page=${page}`;
    const res = await fetch(url);
    if (res.status === 429) {
      saveCache();
      console.error("Rate limit hit. Wait 1-2 minutes, then run the same command again (progress is saved).");
      process.exit(1);
    }
    if (!res.ok) {
      saveCache();
      throw new Error(`Pixabay error ${res.status} for "${query}" (check your API key)`);
    }
    const data = await res.json();
    entry.page = page;
    for (const p of data.hits || []) entry.photos.push({ id: p.id, url: p.webformatURL });
    if (!data.hits || data.hits.length < 100) entry.page = 99;
    await sleep(700);
  }
  saveCache();
  return entry.photos;
}

const used = new Set();
const missing = [];
let done = 0;

for (const [query, list] of groups) {
  const photos = await ensurePhotos(query, list.length + 10);
  for (const g of list) {
    const photo = photos.find((p) => !used.has(p.id));
    if (photo) {
      used.add(photo.id);
      g.image = photo.url;
    } else {
      missing.push(`${g.id} ${g.name}`);
    }
  }
  done++;
  console.log(`[${done}/${groups.size}] "${query}" -> ${list.length} gifts`);
}

const out =
  "const gifts = [\n" + gifts.map((g) => "  " + JSON.stringify(g) + ",").join("\n") + "\n];\n\nexport default gifts;\n";
fs.writeFileSync(GIFTS_PATH, out);

const unique = new Set(gifts.map((g) => g.image)).size;
console.log(`Done. ${gifts.length} gifts, ${unique} unique image URLs.`);
if (missing.length) console.log("No image found for:", missing.join(", "));