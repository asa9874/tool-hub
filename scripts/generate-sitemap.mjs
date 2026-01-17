/**
 * 사이트맵 및 robots.txt 자동 생성 스크립트
 * 
 * 사용법: npm run generate-sitemap
 * 빌드 전에 자동 실행됨
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// 설정 - 실제 배포 URL로 변경 필요
// ============================================
const SITE_URL = 'https://asa9874.github.io/tool-hub';

// 사이트맵에 포함할 페이지 목록
// 새 페이지 추가 시 여기에 등록
const pages = [
  {
    path: '/',
    changefreq: 'daily',
    priority: '1.0',
  },
  {
    path: '/tools/age-calculator',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/privacy-policy',
    changefreq: 'monthly',
    priority: '0.3',
  },
  // 새 도구 페이지 추가 시 여기에 등록
  // {
  //   path: '/tools/character-counter',
  //   changefreq: 'weekly',
  //   priority: '0.9',
  // },
];

// ============================================
// 사이트맵 생성
// ============================================
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  const urlEntries = pages.map(page => `
  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;

  return sitemap;
}

// ============================================
// robots.txt 생성
// ============================================
function generateRobotsTxt() {
  return `# ToolHub Robots.txt
# https://www.robotstxt.org/

User-agent: *
Allow: /

# 사이트맵 위치
Sitemap: ${SITE_URL}/sitemap.xml

# 크롤링 제한 (필요시 추가)
# Disallow: /admin/
# Disallow: /private/
`;
}

// ============================================
// 파일 저장
// ============================================
function saveFiles() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // public 디렉토리가 없으면 생성
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // sitemap.xml 저장
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, generateSitemap(), 'utf-8');
  console.log(`✅ sitemap.xml 생성 완료: ${sitemapPath}`);

  // robots.txt 저장
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, generateRobotsTxt(), 'utf-8');
  console.log(`✅ robots.txt 생성 완료: ${robotsPath}`);

  console.log('\n📝 생성된 페이지 목록:');
  pages.forEach(page => {
    console.log(`   - ${SITE_URL}${page.path}`);
  });
}

// 스크립트 실행
saveFiles();
