import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwind(),  // Tailwind v4 Vite 플러그인
  ],
  // GitHub Pages 배포 시 레포지토리 이름으로 설정
  // 예: https://username.github.io/tool-hub -> base: '/tool-hub/'
  // 루트 도메인 사용 시 '/'로 설정
  base: '/tool-hub/',
  define: {
    global: 'window',  // 필요 시 추가
  },
  build: {
    // 빌드 최적화 설정
    rollupOptions: {
      output: {
        // 청크 분리로 초기 로딩 속도 개선
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});