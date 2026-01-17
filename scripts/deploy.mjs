/**
 * GitHub Pages 배포 스크립트
 * 
 * 사용법: npm run deploy
 * 
 * 이 스크립트는:
 * 1. 사이트맵 및 robots.txt 생성
 * 2. 프로젝트 빌드
 * 3. gh-pages 브랜치에 배포
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function run(command, options = {}) {
  console.log(`\n🚀 실행: ${command}\n`);
  execSync(command, { 
    stdio: 'inherit', 
    cwd: rootDir,
    ...options 
  });
}

async function deploy() {
  try {
    console.log('========================================');
    console.log('GitHub Pages 배포 시작');
    console.log('========================================');

    // 1. 사이트맵 생성
    console.log('\n📄 Step 1: 사이트맵 및 robots.txt 생성');
    run('node scripts/generate-sitemap.mjs');

    // 2. 프로젝트 빌드
    console.log('\n🔨 Step 2: 프로젝트 빌드');
    run('npm run build');

    // 3. 빌드 결과물에 404.html 복사 (이미 public에 있으면 자동 복사됨)
    const notFoundSrc = path.join(rootDir, 'public', '404.html');
    const notFoundDest = path.join(distDir, '404.html');
    if (fs.existsSync(notFoundSrc) && !fs.existsSync(notFoundDest)) {
      fs.copyFileSync(notFoundSrc, notFoundDest);
      console.log('✅ 404.html 복사 완료');
    }

    // 4. gh-pages 브랜치에 배포
    console.log('\n📤 Step 3: gh-pages 브랜치에 배포');
    run('npx gh-pages -d dist');

    console.log('\n========================================');
    console.log('✅ 배포 완료!');
    console.log('========================================');
    console.log('\n🌐 사이트 URL: https://asa9874.github.io/tool-hub');
    console.log('📝 배포 후 몇 분 정도 기다린 후 확인하세요.\n');

  } catch (error) {
    console.error('\n❌ 배포 실패:', error.message);
    process.exit(1);
  }
}

deploy();
