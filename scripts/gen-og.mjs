// OG(1200x630), apple-touch-icon(180), favicon(64) 생성기
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const brandDir = path.join(process.cwd(), "public", "brand");
fs.mkdirSync(brandDir, { recursive: true });

const logoCandidates = [
  "logo.svg",
  "logo.png",
  "logo.jpg",
  "logo.jpeg",
  "kbiz-logo-horizontal.png",
].map((f) => path.join(brandDir, f));
const logoPath = logoCandidates.find((p) => fs.existsSync(p));
if (!logoPath) {
  console.error("[og:gen] public/brand/에 로고가 필요합니다.");
  process.exit(1);
}

const OUT_OG = path.join(brandDir, "og.png");
const OUT_APPLE = path.join(process.cwd(), "public", "apple-touch-icon.png");
const OUT_FAVICON = path.join(process.cwd(), "public", "favicon.png");

const W = 1200;
const H = 630;
const pad = 80;
const bgFrom = process.env.BRAND_PRIMARY_FROM || "#0F2C4C";
const bgTo = process.env.BRAND_PRIMARY_TO || "#1E5AA6";

// Prefer a user-supplied OG source image if available
const ogSourceCandidates = [
  "og-source.png",
  "og-source.jpg",
  "og-source.jpeg",
  "og.png",
  "og.jpg",
  "og.jpeg",
].map((f) => path.join(brandDir, f));
const ogSource = ogSourceCandidates.find((p) => fs.existsSync(p));

const gradientSVG = Buffer.from(
  `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgFrom}" />
      <stop offset="100%" stop-color="${bgTo}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)" />
</svg>`
);

async function generateOG() {
  if (ogSource) {
    await sharp(ogSource)
      .resize(W, H, { fit: "cover", position: "centre" })
      .png()
      .toFile(OUT_OG);
    console.log("[og:gen] ✅ OG (from source):", OUT_OG, "←", ogSource);
    return;
  }
  const meta = await sharp(logoPath).metadata();
  const maxW = W - pad * 2;
  const maxH = H - pad * 2;
  let lw = meta.width || maxW;
  let lh = meta.height || maxH;
  const scale = Math.min(maxW / lw, maxH / lh, 1);
  lw = Math.round(lw * scale);
  lh = Math.round(lh * scale);

  const logoBuf = await sharp(logoPath)
    .resize(lw, lh, { fit: "inside", withoutEnlargement: true })
    .toBuffer();
  const bg = await sharp(gradientSVG).png().toBuffer();
  const composite = await sharp(bg)
    .composite([{ input: logoBuf, top: Math.round((H - lh) / 2), left: Math.round((W - lw) / 2) }])
    .png()
    .toBuffer();
  await sharp(composite).toFile(OUT_OG);
  console.log("[og:gen] ✅ OG (gradient+logo):", OUT_OG);
}

async function generateIcons() {
  // Apple touch icon 180x180 with centered logo
  await sharp({ create: { width: 180, height: 180, channels: 4, background: "#FFFFFF" } })
    .png()
    .composite([
      {
        input: await sharp(logoPath).resize(140, 140, { fit: "inside", withoutEnlargement: true }).toBuffer(),
        top: 20,
        left: 20,
      },
    ])
    .toFile(OUT_APPLE);
  console.log("[og:gen] ✅ Apple:", OUT_APPLE);

  // Favicon 64x64 with centered logo
  await sharp({ create: { width: 64, height: 64, channels: 4, background: "#FFFFFF" } })
    .png()
    .composite([
      {
        input: await sharp(logoPath).resize(52, 52, { fit: "inside", withoutEnlargement: true }).toBuffer(),
        top: 6,
        left: 6,
      },
    ])
    .toFile(OUT_FAVICON);
  console.log("[og:gen] ✅ Favicon:", OUT_FAVICON);
}

async function main() {
  await generateOG();
  await generateIcons();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


