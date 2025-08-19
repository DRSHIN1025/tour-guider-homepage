import fs from "node:fs";
import path from "node:path";

console.log("🔍 OG 이미지 및 메타데이터 검증 시작...");

// 브랜드 이미지 확인
const brandDir = path.join(process.cwd(), "public", "brand");
const requiredImages = ["logo.png", "og.png"];

let allGood = true;

for (const img of requiredImages) {
  const imgPath = path.join(brandDir, img);
  if (fs.existsSync(imgPath)) {
    const stats = fs.statSync(imgPath);
    console.log(`✅ ${img}: ${(stats.size / 1024).toFixed(1)}KB`);
  } else {
    console.log(`❌ ${img}: 파일 없음`);
    allGood = false;
  }
}

// sitemap 확인
const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const stats = fs.statSync(sitemapPath);
  console.log(`✅ sitemap.xml: ${(stats.size / 1024).toFixed(1)}KB`);
} else {
  console.log("❌ sitemap.xml: 파일 없음");
  allGood = false;
}

// robots.txt 확인
const robotsPath = path.join(process.cwd(), "public", "robots.txt");
if (fs.existsSync(robotsPath)) {
  const stats = fs.statSync(robotsPath);
  console.log(`✅ robots.txt: ${(stats.size / 1024).toFixed(1)}KB`);
} else {
  console.log("❌ robots.txt: 파일 없음");
  allGood = false;
}

if (allGood) {
  console.log("🎉 모든 검증 통과!");
} else {
  console.log("⚠️ 일부 검증 실패. 위 항목들을 확인하세요.");
  process.exit(1);
}



