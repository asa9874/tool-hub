import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import { AdSenseScript } from './components/AdBanner';

// 페이지 컴포넌트
import Home from './pages/Home';
import AgeCalculator from './pages/tools/AgeCalculator';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

/**
 * 메인 App 컴포넌트
 * - HelmetProvider: SEO 메타 태그 관리
 * - BrowserRouter: 클라이언트 사이드 라우팅
 * - basename: GitHub Pages 배포 시 서브 경로 설정
 */
function App() {
  // GitHub Pages 배포 시 레포지토리 이름을 basename으로 설정
  // 예: https://username.github.io/tool-hub -> basename="/tool-hub"
  const basename = import.meta.env.BASE_URL;

  return (
    <HelmetProvider>
      {/* AdSense 스크립트 로드 */}
      <AdSenseScript />
      
      <BrowserRouter basename={basename}>
        <Layout>
          <Routes>
            {/* 홈 페이지 */}
            <Route path="/" element={<Home />} />
            
            {/* 도구 페이지들 */}
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            {/* 새 도구 추가 시 여기에 Route 추가 */}
            {/* <Route path="/tools/character-counter" element={<CharacterCounter />} /> */}
            
            {/* 정보 페이지들 */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            
            {/* 404 페이지 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
