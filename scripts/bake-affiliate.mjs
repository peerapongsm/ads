// Bake the real Shopee affiliate listing photos into public/banners/affiliate/.
// Manual refresh tool only (baked images are committed; CI/prod never run this).
// `sharp` is NOT a project dependency (it churns the lockfile cross-platform and
// breaks `npm ci` on the Linux Pages runner) — install it ad-hoc first:
//   npm i -D sharp && node scripts/bake-affiliate.mjs
// then `npm uninstall sharp && git checkout package-lock.json` before committing.
import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// Source images live outside this repo, at the workspace docs folder.
const SRC_DIR = "C:/Users/User/Desktop/project-365/docs/materials/affiliate";
const OUT_DIR = join(ROOT, "public", "banners", "affiliate");

// slug -> source filename (both already share the same basename in this case).
const SLUGS = ["smarttag", "sharpener", "bikelight", "cloth"];

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const slug of SLUGS) {
    const src = join(SRC_DIR, `${slug}.webp`);
    const buf = readFileSync(src);
    const out = await sharp(buf)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 72 })
      .toBuffer();
    const dest = join(OUT_DIR, `${slug}.webp`);
    writeFileSync(dest, out);
    console.log(`${slug}: ${(statSync(src).size / 1024).toFixed(0)}KB -> ${(out.length / 1024).toFixed(0)}KB`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
