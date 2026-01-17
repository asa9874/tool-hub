/**
 * OG Image 및 다양한 사이즈 파비콘 생성 스크립트
 * 실행: npm run generate-images
 * 
 * 필요 패키지: npm install canvas
 */

import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

// 색상 정의
const colors = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  white: '#ffffff',
  lightGray: '#f3f4f6',
  darkGray: '#1f2937',
};

/**
 * OG Image 생성 (1200x630)
 */
function generateOGImage() {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 그라데이션 배경
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 패턴 (점선 그리드)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  for (let i = 0; i < height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }

  // 중앙 카드 배경
  const cardWidth = 900;
  const cardHeight = 400;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 24);
  ctx.fill();

  // 그림자 효과
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 10;

  // 로고 원
  const logoX = cardX + 100;
  const logoY = height / 2;
  const logoRadius = 60;
  
  ctx.shadowColor = 'transparent';
  const logoGradient = ctx.createLinearGradient(logoX - logoRadius, logoY - logoRadius, logoX + logoRadius, logoY + logoRadius);
  logoGradient.addColorStop(0, colors.primary);
  logoGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = logoGradient;
  ctx.beginPath();
  ctx.arc(logoX, logoY, logoRadius, 0, Math.PI * 2);
  ctx.fill();

  // T 문자
  ctx.fillStyle = colors.white;
  ctx.font = 'bold 70px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('T', logoX, logoY + 5);

  // 타이틀
  ctx.fillStyle = colors.darkGray;
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('ToolHub', cardX + 200, logoY - 30);

  // 서브타이틀
  ctx.fillStyle = '#6b7280';
  ctx.font = '32px Arial';
  ctx.fillText('무료 온라인 도구 모음', cardX + 200, logoY + 40);

  // 하단 태그들
  const tags = ['만나이 계산기', '글자수 세기', '단위 변환기', 'JSON 포맷터'];
  let tagX = cardX + 200;
  const tagY = logoY + 110;
  
  ctx.font = '22px Arial';
  tags.forEach((tag, index) => {
    const padding = 16;
    const textWidth = ctx.measureText(tag).width;
    const tagWidth = textWidth + padding * 2;
    
    // 태그 배경
    ctx.fillStyle = colors.lightGray;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY - 18, tagWidth, 36, 18);
    ctx.fill();
    
    // 태그 텍스트
    ctx.fillStyle = '#4b5563';
    ctx.textAlign = 'left';
    ctx.fillText(tag, tagX + padding, tagY + 6);
    
    tagX += tagWidth + 12;
  });

  // 파일 저장
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), buffer);
  console.log('✅ og-image.png 생성 완료 (1200x630)');
}

/**
 * 파비콘 생성 (다양한 사이즈)
 */
function generateFavicons() {
  const sizes = [16, 32, 48, 64, 128, 192, 512];
  
  sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // 그라데이션 배경
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.secondary);
    ctx.fillStyle = gradient;
    
    // 둥근 사각형
    const radius = size * 0.1875; // 약 18.75% 라운드
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
    
    // T 문자
    ctx.fillStyle = colors.white;
    const fontSize = size * 0.55;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('T', size / 2, size / 2 + size * 0.05);
    
    // 파일 저장
    const buffer = canvas.toBuffer('image/png');
    const filename = size === 192 ? 'android-chrome-192x192.png' 
                   : size === 512 ? 'android-chrome-512x512.png'
                   : `favicon-${size}x${size}.png`;
    fs.writeFileSync(path.join(publicDir, filename), buffer);
    console.log(`✅ ${filename} 생성 완료`);
  });
  
  // apple-touch-icon (180x180)
  const appleSize = 180;
  const appleCanvas = createCanvas(appleSize, appleSize);
  const appleCtx = appleCanvas.getContext('2d');
  
  const appleGradient = appleCtx.createLinearGradient(0, 0, appleSize, appleSize);
  appleGradient.addColorStop(0, colors.primary);
  appleGradient.addColorStop(1, colors.secondary);
  appleCtx.fillStyle = appleGradient;
  appleCtx.beginPath();
  appleCtx.roundRect(0, 0, appleSize, appleSize, appleSize * 0.1875);
  appleCtx.fill();
  
  appleCtx.fillStyle = colors.white;
  appleCtx.font = `bold ${appleSize * 0.55}px Arial`;
  appleCtx.textAlign = 'center';
  appleCtx.textBaseline = 'middle';
  appleCtx.fillText('T', appleSize / 2, appleSize / 2 + appleSize * 0.05);
  
  const appleBuffer = appleCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleBuffer);
  console.log('✅ apple-touch-icon.png 생성 완료 (180x180)');
}

/**
 * Web Manifest 생성
 */
function generateManifest() {
  const manifest = {
    name: 'ToolHub - 무료 온라인 도구 모음',
    short_name: 'ToolHub',
    description: '만나이 계산기, 글자수 세기, 단위 변환기 등 다양한 무료 온라인 도구',
    start_url: '/tool-hub/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/tool-hub/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/tool-hub/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
  
  fs.writeFileSync(
    path.join(publicDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✅ manifest.json 생성 완료');
}

// 실행
console.log('🎨 이미지 생성 시작...\n');

try {
  generateOGImage();
  generateFavicons();
  generateManifest();
  console.log('\n🎉 모든 이미지 생성 완료!');
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  console.log('\n💡 canvas 패키지가 설치되지 않았다면:');
  console.log('   npm install canvas');
  process.exit(1);
}
