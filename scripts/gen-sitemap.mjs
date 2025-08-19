import fs from "node:fs";
import path from "node:path";

const SITE = process.env.SITE_URL || "https://www.tourguider.biz";

const pages = [
  "",           // /
  "login",      // /login
  "about",      // /about
  // TODO: 정적 경로 여기에 추가 (예: "packages", "guides/[id]" 등 정적 페이지만)
];

const urls = pages.map(p => {
  const loc = `${SITE}/${p}`.replace(/\/+$/, "/");
  return `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
}).join("");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

const out = path.join(process.cwd(), "public", "sitemap.xml");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, xml);

console.log(`sitemap.xml written: ${out}`);


