import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { JSX } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import LangProvider from './components/LangProvider';
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

// 디자인 도구 추가
import PlaceholderImage from './pages/tools/PlaceholderImage';
import SvgBlobGenerator from './pages/tools/SvgBlobGenerator';
import SocialMediaSizeGuide from './pages/tools/SocialMediaSizeGuide';
import CssFilterLab from './pages/tools/CssFilterLab';
import CssPatternGenerator from './pages/tools/CssPatternGenerator';

// UI/UX 및 편의 도구 추가
import LogoSafeArea from './pages/tools/LogoSafeArea';
import FaviconPreview from './pages/tools/FaviconPreview';
import ButtonGenerator from './pages/tools/ButtonGenerator';
import ColorBlindnessSimulator from './pages/tools/ColorBlindnessSimulator';
import ScreenResolution from './pages/tools/ScreenResolution';

/**
 * 메인 App 컴포넌트
 * - HelmetProvider: SEO 메타 태그 관리
 * - BrowserRouter: 클라이언트 사이드 라우팅
 * - LangProvider: URL 경로 기반 언어 자동 동기화 (/en/* → 영어)
 * - basename: GitHub Pages 배포 시 서브 경로 설정
 */

/** 홈/정책 및 도구 라우트 설정 (중복 없이 /en/* 자동 생성) */
const toolRoutes: Array<{ path: string; element: JSX.Element }> = [
  // 금융/부동산 도구
  { path: '/tools/loan-calculator', element: <LoanCalculator /> },
  { path: '/tools/savings-calculator', element: <SavingsCalculator /> },
  { path: '/tools/brokerage-fee-calculator', element: <BrokerageFeeCalculator /> },
  { path: '/tools/severance-calculator', element: <SeveranceCalculator /> },

  // 건강/라이프스타일 도구
  { path: '/tools/bmi-calculator', element: <BmiCalculator /> },
  { path: '/tools/bmr-calculator', element: <BmrCalculator /> },
  { path: '/tools/calorie-burn-calculator', element: <CalorieBurnCalculator /> },

  // 생활/사회 도구
  { path: '/tools/age-calculator', element: <AgeCalculator /> },
  { path: '/tools/military-calculator', element: <MilitaryCalculator /> },
  { path: '/tools/gpa-calculator', element: <GpaCalculator /> },
  { path: '/tools/salary-calculator', element: <SalaryCalculator /> },
  { path: '/tools/zodiac-calculator', element: <ZodiacCalculator /> },
  { path: '/tools/d-day-calculator', element: <DdayCalculator /> },

  // 업무/생산성 도구
  { path: '/tools/character-counter', element: <CharacterCounter /> },
  { path: '/tools/percent-calculator', element: <PercentCalculator /> },
  { path: '/tools/unit-converter', element: <UnitConverter /> },

  // 개발/IT 도구
  { path: '/tools/json-formatter', element: <JsonFormatter /> },
  { path: '/tools/base64', element: <Base64Tool /> },
  { path: '/tools/url-encoder', element: <UrlEncoder /> },
  { path: '/tools/lorem-ipsum', element: <LoremIpsum /> },

  // 게임/재미 도구
  { path: '/tools/spin-wheel', element: <SpinWheel /> },
  { path: '/tools/food-slot-machine', element: <FoodSlotMachine /> },
  { path: '/tools/scratch-card', element: <ScratchCard /> },
  { path: '/tools/team-generator', element: <TeamGenerator /> },
  { path: '/tools/magic-conch', element: <MagicConch /> },
  { path: '/tools/fortune-cookie', element: <FortuneCookie /> },
  { path: '/tools/reaction-test', element: <ReactionTest /> },

  // 유틸리티 도구
  { path: '/tools/word-frequency', element: <WordFrequency /> },
  { path: '/tools/browser-info', element: <BrowserInfo /> },
  { path: '/tools/reserve-calculator', element: <ReserveCalculator /> },
  { path: '/tools/sleep-calculator', element: <SleepCalculator /> },

  // 추가 도구
  { path: '/tools/qr-generator', element: <QrGenerator /> },
  { path: '/tools/case-converter', element: <CaseConverter /> },
  { path: '/tools/coin-flip', element: <CoinFlip /> },
  { path: '/tools/dice-roller', element: <DiceRoller /> },
  { path: '/tools/mandalart', element: <MandalartChart /> },
  { path: '/tools/korean-romanizer', element: <KoreanRomanizer /> },
  { path: '/tools/number-base-converter', element: <NumberBaseConverter /> },
  { path: '/tools/list-shuffler', element: <ListShuffler /> },
  { path: '/tools/timer', element: <WebTimer /> },
  { path: '/tools/color-converter', element: <ColorConverter /> },
  { path: '/tools/sticky-note', element: <StickyNote /> },
  { path: '/tools/webp-converter', element: <WebpConverter /> },
  { path: '/tools/ip-port-checker', element: <IpPortChecker /> },

  // 쇼핑/실생활 도구
  { path: '/tools/unit-price-calculator', element: <UnitPriceCalculator /> },
  { path: '/tools/discount-calculator', element: <DiscountCalculator /> },
  { path: '/tools/size-converter', element: <SizeConverter /> },
  { path: '/tools/water-intake-calculator', element: <WaterIntakeCalculator /> },

  // 유틸리티/개발 도구
  { path: '/tools/html-stripper', element: <HtmlStripper /> },
  { path: '/tools/morse-code', element: <MorseCode /> },

  // 음악/창작 도구
  { path: '/tools/metronome', element: <Metronome /> },
  { path: '/tools/chord-transposer', element: <ChordTransposer /> },

  // 디자인 도구
  { path: '/tools/palette-generator', element: <PaletteGenerator /> },
  { path: '/tools/gradient-generator', element: <GradientGenerator /> },
  { path: '/tools/box-shadow-generator', element: <BoxShadowGenerator /> },
  { path: '/tools/glassmorphism-generator', element: <GlassmorphismGenerator /> },
  { path: '/tools/neumorphism-generator', element: <NeumorphismGenerator /> },
  { path: '/tools/css-grid-generator', element: <CssGridGenerator /> },

  // 건강/생활 추가
  { path: '/tools/caffeine-calculator', element: <CaffeineCalculator /> },
  { path: '/tools/lunar-calendar', element: <LunarCalendar /> },

  // 개발/IT 추가
  { path: '/tools/diff-checker', element: <DiffChecker /> },
  { path: '/tools/favicon-generator', element: <FaviconGenerator /> },
  { path: '/tools/exif-remover', element: <ExifRemover /> },
  { path: '/tools/exif-viewer', element: <ExifViewer /> },

  // 디자인 추가
  { path: '/tools/placeholder-image', element: <PlaceholderImage /> },
  { path: '/tools/svg-blob-generator', element: <SvgBlobGenerator /> },
  { path: '/tools/social-media-size-guide', element: <SocialMediaSizeGuide /> },
  { path: '/tools/css-filter-lab', element: <CssFilterLab /> },
  { path: '/tools/css-pattern-generator', element: <CssPatternGenerator /> },

  // UI/UX 및 편의 도구
  { path: '/tools/logo-safe-area', element: <LogoSafeArea /> },
  { path: '/tools/favicon-preview', element: <FaviconPreview /> },
  { path: '/tools/button-generator', element: <ButtonGenerator /> },
  { path: '/tools/color-blindness-simulator', element: <ColorBlindnessSimulator /> },
  { path: '/tools/screen-resolution', element: <ScreenResolution /> },

  // 정보 페이지
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
];

function App() {
  // GitHub Pages 배포 시 레포지토리 이름을 basename으로 설정
  // 예: https://username.github.io/tool-hub -> basename="/tool-hub"
  const basename = import.meta.env.BASE_URL;

  return (
    <HelmetProvider>
      {/* AdSense 스크립트 로드 */}
      <AdSenseScript />

      <BrowserRouter basename={basename}>
        {/* URL 경로 기반 언어 자동 동기화 */}
        <LangProvider>
          <Layout>
            <Routes>
              {/* 홈 페이지 (한국어 / 영어) */}
              <Route path="/" element={<Home />} />
              <Route path="/en" element={<Home />} />

              {/* 모든 도구·정보 페이지: 한국어 경로 + 영어(/en/*) 경로 자동 생성 */}
              {toolRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              {toolRoutes.map(({ path, element }) => (
                <Route key={`/en${path}`} path={`/en${path}`} element={element} />
              ))}

              {/* 404 페이지 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </LangProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
