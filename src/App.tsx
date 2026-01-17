import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import { AdSenseScript } from './components/AdBanner';

// 페이지 컴포넌트
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

// 도구 페이지들 - 금융/부동산
import LoanCalculator from './pages/tools/LoanCalculator';
import SavingsCalculator from './pages/tools/SavingsCalculator';
import BrokerageFeeCalculator from './pages/tools/BrokerageFeeCalculator';
import SeveranceCalculator from './pages/tools/SeveranceCalculator';

// 도구 페이지들 - 건강/라이프스타일
import BmiCalculator from './pages/tools/BmiCalculator';
import BmrCalculator from './pages/tools/BmrCalculator';
import CalorieBurnCalculator from './pages/tools/CalorieBurnCalculator';

// 도구 페이지들 - 생활/사회
import AgeCalculator from './pages/tools/AgeCalculator';
import MilitaryCalculator from './pages/tools/MilitaryCalculator';
import GpaCalculator from './pages/tools/GpaCalculator';
import SalaryCalculator from './pages/tools/SalaryCalculator';
import ZodiacCalculator from './pages/tools/ZodiacCalculator';
import DdayCalculator from './pages/tools/DdayCalculator';

// 도구 페이지들 - 업무/생산성
import CharacterCounter from './pages/tools/CharacterCounter';
import PercentCalculator from './pages/tools/PercentCalculator';
import UnitConverter from './pages/tools/UnitConverter';

// 도구 페이지들 - 개발/IT
import JsonFormatter from './pages/tools/JsonFormatter';
import Base64Tool from './pages/tools/Base64Tool';
import UrlEncoder from './pages/tools/UrlEncoder';
import LoremIpsum from './pages/tools/LoremIpsum';

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
            
            {/* 금융/부동산 도구 */}
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/savings-calculator" element={<SavingsCalculator />} />
            <Route path="/tools/brokerage-fee-calculator" element={<BrokerageFeeCalculator />} />
            <Route path="/tools/severance-calculator" element={<SeveranceCalculator />} />
            
            {/* 건강/라이프스타일 도구 */}
            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/bmr-calculator" element={<BmrCalculator />} />
            <Route path="/tools/calorie-burn-calculator" element={<CalorieBurnCalculator />} />
            
            {/* 생활/사회 도구 */}
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/military-calculator" element={<MilitaryCalculator />} />
            <Route path="/tools/gpa-calculator" element={<GpaCalculator />} />
            <Route path="/tools/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/tools/zodiac-calculator" element={<ZodiacCalculator />} />
            <Route path="/tools/d-day-calculator" element={<DdayCalculator />} />
            
            {/* 업무/생산성 도구 */}
            <Route path="/tools/character-counter" element={<CharacterCounter />} />
            <Route path="/tools/percent-calculator" element={<PercentCalculator />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            
            {/* 개발/IT 도구 */}
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/base64" element={<Base64Tool />} />
            <Route path="/tools/url-encoder" element={<UrlEncoder />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
            
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
