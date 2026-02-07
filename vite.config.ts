import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwind(),  // Tailwind v4 Vite 플러그인
  ],
  // Netlify 배포: 항상 루트에 배포
  base: '/',
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