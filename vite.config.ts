import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwind(),  // Tailwind v4 Vite 플러그인
  ],
  // GitHub Pages 배포 시에만 '/tool-hub/' 사용
  // 로컬 개발 환경에서는 '/' 사용
  base: process.env.NODE_ENV === 'production' ? '/tool-hub/' : '/',
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