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

// 도구 페이지들 - 게임/재미
import SpinWheel from './pages/tools/SpinWheel';
import FoodSlotMachine from './pages/tools/FoodSlotMachine';
import ScratchCard from './pages/tools/ScratchCard';
import TeamGenerator from './pages/tools/TeamGenerator';
import MagicConch from './pages/tools/MagicConch';
import FortuneCookie from './pages/tools/FortuneCookie';
import ReactionTest from './pages/tools/ReactionTest';

// 도구 페이지들 - 유틸리티
import WordFrequency from './pages/tools/WordFrequency';
import BrowserInfo from './pages/tools/BrowserInfo';
import ReserveCalculator from './pages/tools/ReserveCalculator';
import SleepCalculator from './pages/tools/SleepCalculator';

// 새로 추가된 도구들
import QrGenerator from './pages/tools/QrGenerator';
import CaseConverter from './pages/tools/CaseConverter';
import CoinFlip from './pages/tools/CoinFlip';
import DiceRoller from './pages/tools/DiceRoller';
import MandalartChart from './pages/tools/MandalartChart';
import KoreanRomanizer from './pages/tools/KoreanRomanizer';
import NumberBaseConverter from './pages/tools/NumberBaseConverter';
import ListShuffler from './pages/tools/ListShuffler';
import WebTimer from './pages/tools/WebTimer';
import ColorConverter from './pages/tools/ColorConverter';
import StickyNote from './pages/tools/StickyNote';
import WebpConverter from './pages/tools/WebpConverter';
import IpPortChecker from './pages/tools/IpPortChecker';

// 쇼핑/실생활 도구
import UnitPriceCalculator from './pages/tools/UnitPriceCalculator';
import DiscountCalculator from './pages/tools/DiscountCalculator';
import SizeConverter from './pages/tools/SizeConverter';
import WaterIntakeCalculator from './pages/tools/WaterIntakeCalculator';

// 유틸리티/개발 도구 추가
import HtmlStripper from './pages/tools/HtmlStripper';
import MorseCode from './pages/tools/MorseCode';

// 음악/창작 도구
import Metronome from './pages/tools/Metronome';
import ChordTransposer from './pages/tools/ChordTransposer';

// 디자인 도구
import PaletteGenerator from './pages/tools/PaletteGenerator';
import GradientGenerator from './pages/tools/GradientGenerator';
import BoxShadowGenerator from './pages/tools/BoxShadowGenerator';
import GlassmorphismGenerator from './pages/tools/GlassmorphismGenerator';
import NeumorphismGenerator from './pages/tools/NeumorphismGenerator';
import CssGridGenerator from './pages/tools/CssGridGenerator';

// 건강/생활 도구 추가
import CaffeineCalculator from './pages/tools/CaffeineCalculator';
import LunarCalendar from './pages/tools/LunarCalendar';

// 개발/IT 도구 추가
import DiffChecker from './pages/tools/DiffChecker';
import FaviconGenerator from './pages/tools/FaviconGenerator';
import ExifRemover from './pages/tools/ExifRemover';
import ExifViewer from './pages/tools/ExifViewer';

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
            
            {/* 게임/재미 도구 */}
            <Route path="/tools/spin-wheel" element={<SpinWheel />} />
            <Route path="/tools/food-slot-machine" element={<FoodSlotMachine />} />
            <Route path="/tools/scratch-card" element={<ScratchCard />} />
            <Route path="/tools/team-generator" element={<TeamGenerator />} />
            <Route path="/tools/magic-conch" element={<MagicConch />} />
            <Route path="/tools/fortune-cookie" element={<FortuneCookie />} />
            <Route path="/tools/reaction-test" element={<ReactionTest />} />
            
            {/* 유틸리티 도구 */}
            <Route path="/tools/word-frequency" element={<WordFrequency />} />
            <Route path="/tools/browser-info" element={<BrowserInfo />} />
            <Route path="/tools/reserve-calculator" element={<ReserveCalculator />} />
            <Route path="/tools/sleep-calculator" element={<SleepCalculator />} />
            
            {/* 새로 추가된 도구 */}
            <Route path="/tools/qr-generator" element={<QrGenerator />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/coin-flip" element={<CoinFlip />} />
            <Route path="/tools/dice-roller" element={<DiceRoller />} />
            <Route path="/tools/mandalart" element={<MandalartChart />} />
            <Route path="/tools/korean-romanizer" element={<KoreanRomanizer />} />
            <Route path="/tools/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="/tools/list-shuffler" element={<ListShuffler />} />
            <Route path="/tools/timer" element={<WebTimer />} />
            <Route path="/tools/color-converter" element={<ColorConverter />} />
            <Route path="/tools/sticky-note" element={<StickyNote />} />
            <Route path="/tools/webp-converter" element={<WebpConverter />} />
            <Route path="/tools/ip-port-checker" element={<IpPortChecker />} />
            
            {/* 쇼핑/실생활 도구 */}
            <Route path="/tools/unit-price-calculator" element={<UnitPriceCalculator />} />
            <Route path="/tools/discount-calculator" element={<DiscountCalculator />} />
            <Route path="/tools/size-converter" element={<SizeConverter />} />
            <Route path="/tools/water-intake-calculator" element={<WaterIntakeCalculator />} />
            
            {/* 유틸리티/개발 도구 추가 */}
            <Route path="/tools/html-stripper" element={<HtmlStripper />} />
            <Route path="/tools/morse-code" element={<MorseCode />} />
            
            {/* 음악/창작 도구 */}
            <Route path="/tools/metronome" element={<Metronome />} />
            <Route path="/tools/chord-transposer" element={<ChordTransposer />} />
            
            {/* 디자인 도구 */}
            <Route path="/tools/palette-generator" element={<PaletteGenerator />} />
            <Route path="/tools/gradient-generator" element={<GradientGenerator />} />
            <Route path="/tools/box-shadow-generator" element={<BoxShadowGenerator />} />
            <Route path="/tools/glassmorphism-generator" element={<GlassmorphismGenerator />} />
            <Route path="/tools/neumorphism-generator" element={<NeumorphismGenerator />} />
            <Route path="/tools/css-grid-generator" element={<CssGridGenerator />} />
            
            {/* 건강/생활 도구 추가 */}
            <Route path="/tools/caffeine-calculator" element={<CaffeineCalculator />} />
            <Route path="/tools/lunar-calendar" element={<LunarCalendar />} />
            
            {/* 개발/IT 도구 추가 */}
            <Route path="/tools/diff-checker" element={<DiffChecker />} />
            <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
            <Route path="/tools/exif-remover" element={<ExifRemover />} />
            <Route path="/tools/exif-viewer" element={<ExifViewer />} />
            
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
