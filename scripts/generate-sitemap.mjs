/**
 * ?ъ씠?몃㏊ 諛?robots.txt ?먮룞 ?앹꽦 ?ㅽ겕由쏀듃
 * - ?쒓뎅??湲곕낯 寃쎈줈 + ?곸뼱(/en/*) 寃쎈줈 紐⑤몢 ?ы븿
 * - 湲濡쒕쾶 ?섏슂 ?꾧뎄??xhtml:link hreflang 援먯감 李몄“ ?앹꽦
 *
 * ?ъ슜踰? npm run generate-sitemap
 * 鍮뚮뱶 ?꾩뿉 ?먮룞 ?ㅽ뻾??
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// ?ㅼ젙
// ============================================
const SITE_URL = process.env.SITE_URL || 'https://useful-toolhub.netlify.app';

// ============================================
// ?곸뼱 踰꾩쟾?먯꽌 ?쒖쇅???쒓뎅 ?뱁솕 ?꾧뎄 寃쎈줈 紐⑸줉
// (湲濡쒕쾶 ?섏슂 ?놁쓬 ??/en/* 寃쎈줈 誘몄깮??
// ============================================
const KOREAN_ONLY_PATHS = new Set([
  '/tools/military-calculator',    // ?쒓뎅 援??꾩뿭??
  '/tools/korean-romanizer',       // ?쒓뎅??濡쒕쭏??蹂??
  '/tools/brokerage-fee-calculator', // ?쒓뎅 遺?숈궛 以묎컻?섏닔猷?
  '/tools/severance-calculator',   // ?쒓뎅 ?댁쭅湲?
  '/tools/reserve-calculator',     // ?쒓뎅 ?덈퉬援?
  '/tools/food-slot-machine',      // ?쒓뎅 ?뚯떇 ?щ’癒몄떊
  '/tools/lunar-calendar',         // ?뚮젰 (?쒓뎅/?숈븘?쒖븘 ?쒖젙)
]);

// ============================================
// ?ъ씠?몃㏊???ы븿???섏씠吏 紐⑸줉
// ============================================
const pages = [
  {
    path: '/',
    changefreq: 'daily',
    priority: '1.0',
  },
  // === 湲덉쑖/遺?숈궛 ?꾧뎄 ===
  { path: '/tools/loan-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/savings-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/brokerage-fee-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/severance-calculator', changefreq: 'weekly', priority: '0.9' },
  // === 嫄닿컯/?쇱씠?꾩뒪????꾧뎄 ===
  { path: '/tools/bmi-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/bmr-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/calorie-burn-calculator', changefreq: 'weekly', priority: '0.8' },
  // === ?앺솢/?ы쉶 ?꾧뎄 ===
  { path: '/tools/age-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/military-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/gpa-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/salary-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/zodiac-calculator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/d-day-calculator', changefreq: 'weekly', priority: '0.8' },
  // === ?낅Т/?앹궛???꾧뎄 ===
  { path: '/tools/character-counter', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/percent-calculator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/unit-converter', changefreq: 'weekly', priority: '0.8' },
  // === 媛쒕컻/IT ?꾧뎄 ===
  { path: '/tools/json-formatter', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/base64', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/url-encoder', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/lorem-ipsum', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/diff-checker', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/number-base-converter', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/case-converter', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/html-stripper', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/ip-port-checker', changefreq: 'weekly', priority: '0.8' },
  // === ?쇳븨/?ㅼ깮???꾧뎄 ===
  { path: '/tools/unit-price-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/discount-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/size-converter', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/water-intake-calculator', changefreq: 'weekly', priority: '0.8' },
  // === 寃뚯엫/?щ? ?꾧뎄 ===
  { path: '/tools/spin-wheel', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/food-slot-machine', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/scratch-card', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/team-generator', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/magic-conch', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/fortune-cookie', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/reaction-test', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/coin-flip', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/dice-roller', changefreq: 'weekly', priority: '0.7' },
  // === ?좏떥由ы떚 ?꾧뎄 ===
  { path: '/tools/word-frequency', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/browser-info', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/reserve-calculator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/sleep-calculator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/qr-generator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/mandalart', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/korean-romanizer', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/list-shuffler', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/timer', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/sticky-note', changefreq: 'weekly', priority: '0.7' },
  { path: '/tools/webp-converter', changefreq: 'weekly', priority: '0.8' },
  // === ?뚯븙/李쎌옉 ?꾧뎄 ===
  { path: '/tools/metronome', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/chord-transposer', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/morse-code', changefreq: 'weekly', priority: '0.8' },
  // === ?붿옄???꾧뎄 ===
  { path: '/tools/palette-generator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/gradient-generator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/box-shadow-generator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/glassmorphism-generator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/neumorphism-generator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/css-grid-generator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/color-converter', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/placeholder-image', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/svg-blob-generator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/social-media-size-guide', changefreq: 'monthly', priority: '0.9' },
  { path: '/tools/css-filter-lab', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/css-pattern-generator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/logo-safe-area', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/favicon-preview', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/button-generator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/color-blindness-simulator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/screen-resolution', changefreq: 'weekly', priority: '0.8' },
  // === 嫄닿컯/?앺솢 異붽? ===
  { path: '/tools/caffeine-calculator', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/lunar-calendar', changefreq: 'weekly', priority: '0.9' },
  // === 媛쒕컻/IT 異붽? ===
  { path: '/tools/favicon-generator', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/exif-remover', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/exif-viewer', changefreq: 'weekly', priority: '0.8' },
  // === UI/UX 異붽? ===
  // === UI/UX 추가 (favicon-preview는 이미 디자인 섹션에 등록됨) ===
  // === 정보 페이지 ===
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
];

// ============================================
// ?ъ씠?몃㏊ ?앹꽦 (?쒓뎅??+ ?곸뼱 hreflang ?ы븿)
// ============================================
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  /**
   * ?⑥씪 <url> ?뷀듃由??앹꽦.
   * @param {string} path  - 寃쎈줈 (?? /tools/bmi-calculator ?먮뒗 /en/tools/bmi-calculator)
   * @param {string} changefreq
   * @param {string} priority
   * @param {boolean} hasEnVersion - /en/* 踰꾩쟾??議댁옱?섎뒗吏 ?щ?
   */
  function buildUrlEntry(path, changefreq, priority, hasEnVersion) {
    const isEnPath = path.startsWith('/en');
    const koPath = isEnPath ? (path.replace(/^\/en/, '') || '/') : path;
    const enPath = isEnPath ? path : (path === '/' ? '/en' : `/en${path}`);
    const koUrl = `${SITE_URL}${koPath}`;
    const enUrl = `${SITE_URL}${enPath}`;

    const hreflang = hasEnVersion
      ? `
    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${koUrl}"/>`
      : '';

    return `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${hreflang}
  </url>`;
  }

  const entries = [];

  for (const page of pages) {
    const hasEn = !KOREAN_ONLY_PATHS.has(page.path);

    // ?쒓뎅??湲곕낯) URL ?뷀듃由?
    entries.push(buildUrlEntry(page.path, page.changefreq, page.priority, hasEn));

    // ?곸뼱 URL ?뷀듃由?(湲濡쒕쾶 ?섏슂 ?꾧뎄留?
    if (hasEn) {
      const enPath = page.path === '/' ? '/en' : `/en${page.path}`;
      // 영어판도 동일 priority 사용 (ko/en 대등하게 취급)
      entries.push(buildUrlEntry(enPath, page.changefreq, page.priority, true));
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.join('')}
</urlset>`;

  return sitemap;
}

// ============================================
// robots.txt ?앹꽦
// ============================================
function generateRobotsTxt() {
  return `# ToolHub Robots.txt
# https://www.robotstxt.org/

User-agent: *
Allow: /

# ?ъ씠?몃㏊ ?꾩튂
Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// ============================================
// ?뚯씪 ???
// ============================================
function saveFiles() {
  const publicDir = path.join(__dirname, '..', 'public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // sitemap.xml ???
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, generateSitemap(), 'utf-8');
  console.log(`sitemap.xml generated: ${sitemapPath}`);

  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, generateRobotsTxt(), 'utf-8');
  console.log(`robots.txt generated: ${robotsPath}`);

  const koCount = pages.length;
  const enCount = pages.filter(p => !KOREAN_ONLY_PATHS.has(p.path)).length;
  console.log(`Total URLs: Korean ${koCount} + English ${enCount} = ${koCount + enCount}`);
}

// ?ㅽ겕由쏀듃 ?ㅽ뻾
saveFiles();
