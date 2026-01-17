# 🤖 ToolHub 프로젝트 - LLM 개발 가이드

이 문서는 AI/LLM이 ToolHub 프로젝트에 새로운 페이지나 도구를 추가할 때 참조하는 가이드입니다.

---

## 📁 프로젝트 구조 개요

```
tool-hub/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── SEO.tsx         # SEO 메타 태그 컴포넌트 (필수)
│   │   ├── AdBanner.tsx    # 광고 배너 컴포넌트
│   │   └── Layout.tsx      # 좌측 사이드바 레이아웃
│   ├── config/
│   │   └── siteConfig.ts   # 전역 설정 (도구 목록 등록)
│   ├── pages/
│   │   ├── Home.tsx        # 홈페이지
│   │   ├── PrivacyPolicy.tsx
│   │   ├── NotFound.tsx
│   │   └── tools/          # 🎯 새 도구는 여기에 추가
│   │       └── AgeCalculator.tsx
│   ├── App.tsx             # 라우터 설정
│   └── main.tsx
├── scripts/
│   └── generate-sitemap.mjs  # 사이트맵 생성 (페이지 등록)
└── public/
    ├── sitemap.xml (자동 생성)
    └── robots.txt (자동 생성)
```

---

## 🎯 새 도구 페이지 추가 - 완전한 체크리스트

새 도구를 추가할 때 **반드시 5개 파일을 수정**해야 합니다:

### ✅ 필수 작업 목록

1. [ ] **도구 컴포넌트 생성** - `src/pages/tools/NewTool.tsx`
2. [ ] **라우터 등록** - `src/App.tsx`
3. [ ] **사이트 설정 등록** - `src/config/siteConfig.ts`
4. [ ] **사이트맵 등록** - `scripts/generate-sitemap.mjs`
5. [ ] **사이드바 자동 업데이트 확인** - Layout.tsx (자동)

---

## 📝 1단계: 새 도구 컴포넌트 생성

### 파일 위치
`src/pages/tools/YourToolName.tsx`

### 필수 요구사항

✅ **반드시 포함해야 할 것들:**
- `SEO` 컴포넌트 (react-helmet-async)
- 고유한 `title`, `description`, `keywords`
- `siteConfig.tools`에서 도구 정보 가져오기
- 구조화된 데이터 (Schema.org JSON-LD)
- **H1 태그는 페이지당 정확히 1개**
- FAQ 섹션 (SEO에 매우 유리)
- 시맨틱 HTML 태그 (`<section>`, `<article>`, `<header>`)

### 템플릿 코드

```typescript
import { useState } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

// 다국어 지원을 위한 텍스트 (i18n 확장 고려)
const i18n = {
  ko: {
    title: '도구 이름',
    subtitle: '부제목',
    description: '설명',
    // ... 필요한 텍스트 추가
  },
};

/**
 * 도구 이름 페이지
 * - SEO 최적화 구조
 * - 다국어(i18n) 확장 고려
 */
export default function YourToolName() {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<any>(null);
  const lang = 'ko';
  const t = i18n[lang];

  // siteConfig에서 도구 정보 가져오기
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'your-tool-id');

  // 구조화된 데이터 (WebApplication Schema)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
  };

  // FAQ 구조화된 데이터
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '질문 1',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '답변 1',
        },
      },
      // ... 더 많은 FAQ
    ],
  };

  // 도구 로직 함수
  const handleCalculate = () => {
    // 계산 로직
    setResult(/* 결과 */);
  };

  return (
    <>
      <SEO
        title={toolInfo?.title || t.title}
        description={toolInfo?.description || t.description}
        keywords={toolInfo?.keywords}
        canonical={toolInfo?.path}
        structuredData={structuredData}
      />

      {/* FAQ 구조화된 데이터 추가 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* 페이지 헤더 - H1 태그는 페이지당 하나만 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600">
            {t.description}
          </p>
        </header>

        {/* 도구 입력 폼 */}
        <section 
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8"
          aria-labelledby="tool-heading"
        >
          <h2 id="tool-heading" className="sr-only">도구 입력</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                입력 레이블
              </label>
              <input
                type="text"
                id="input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예시 입력값"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              계산하기
            </button>
          </div>
        </section>

        {/* 결과 표시 */}
        {result && (
          <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">결과</h2>
            {/* 결과 내용 */}
          </section>
        )}

        {/* 중간 광고 */}
        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ 섹션 - SEO에 매우 중요 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">자주 묻는 질문</h2>
          
          <div className="space-y-6">
            <article className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Q. 질문 1
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A. 답변 1
              </p>
            </article>
            {/* 더 많은 FAQ */}
          </div>
        </section>

        {/* 추가 설명 콘텐츠 - SEO를 위한 관련 키워드 포함 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            도구 이름 사용 방법
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              이 <strong>도구 이름</strong>은... (SEO를 위한 설명 텍스트 최소 300자)
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
```

---

## 🔧 2단계: App.tsx에 라우터 등록

### 파일: `src/App.tsx`

```typescript
import YourToolName from './pages/tools/YourToolName';

function App() {
  return (
    <HelmetProvider>
      <AdSenseScript />
      <BrowserRouter basename={basename}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* 🎯 새 도구 라우트 추가 */}
            <Route path="/tools/your-tool-name" element={<YourToolName />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}
```

### ⚠️ 주의사항
- 경로는 **반드시 소문자와 하이픈**만 사용 (`/tools/word-counter`)
- 파일명은 PascalCase (`WordCounter.tsx`)
- 경로와 siteConfig의 path가 일치해야 함

---

## ⚙️ 3단계: siteConfig.ts에 도구 등록

### 파일: `src/config/siteConfig.ts`

```typescript
export const siteConfig = {
  // ... 기존 설정

  tools: [
    // 🎯 새 도구 추가
    {
      id: 'your-tool-id',           // 고유 ID (kebab-case)
      path: '/tools/your-tool-name', // 라우터 경로와 동일
      title: '도구 이름 - 간단한 설명', // SEO 제목 (50-60자)
      description: '도구에 대한 상세 설명. 주요 기능과 사용 이유를 포함합니다.', // 150-160자
      keywords: ['키워드1', '키워드2', '키워드3', '키워드4', '키워드5'], // 5-10개
      category: '계산기', // 카테고리 (사이드바 그룹화용)
    },
    // 기존 도구들...
  ],
};
```

### 📝 작성 가이드

| 항목 | 길이 | 예시 |
|------|------|------|
| **title** | 50-60자 | `글자수 세기 - 공백 포함/제외 문자 수 계산` |
| **description** | 150-160자 | `텍스트의 글자 수, 단어 수, 바이트 수를 실시간으로 계산합니다. 공백 포함/제외 옵션 제공.` |
| **keywords** | 5-10개 | `['글자수 세기', '문자 수 계산', '바이트 계산']` |
| **category** | 짧게 | `텍스트`, `계산기`, `변환기` 등 |

---

## 🗺️ 4단계: 사이트맵에 페이지 등록

### 파일: `scripts/generate-sitemap.mjs`

```javascript
const pages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  
  // 🎯 새 도구 추가
  {
    path: '/tools/your-tool-name',
    changefreq: 'weekly',
    priority: '0.9',
  },
  
  // 기존 페이지들...
  { path: '/tools/age-calculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
];
```

### 우선순위 가이드
- `1.0`: 홈페이지
- `0.9`: 주요 도구 페이지
- `0.7`: 일반 도구 페이지
- `0.3`: 정보 페이지 (개인정보처리방침 등)

---

## 🎨 코딩 컨벤션 및 베스트 프랙티스

### 1. TypeScript 타입 가져오기

```typescript
// ✅ 올바른 방법
import { useState } from 'react';
import type { ReactNode } from 'react';

// ❌ 잘못된 방법 (verbatimModuleSyntax 오류)
import { ReactNode, useState } from 'react';
```

### 2. 파일명 규칙

| 타입 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `AgeCalculator.tsx` |
| 설정 파일 | camelCase | `siteConfig.ts` |
| URL 경로 | kebab-case | `/tools/age-calculator` |
| 도구 ID | kebab-case | `'age-calculator'` |

### 3. SEO 최적화 체크리스트

- [ ] 각 페이지마다 고유한 `title`, `description`, `keywords`
- [ ] H1 태그는 페이지당 정확히 1개
- [ ] H2, H3는 계층 구조를 지켜서 사용
- [ ] 구조화된 데이터 (JSON-LD) 포함
- [ ] FAQ 섹션 추가 (검색 노출에 매우 유리)
- [ ] 최소 300자 이상의 설명 텍스트
- [ ] 관련 키워드를 자연스럽게 포함

### 4. HTML 구조 규칙

```tsx
// ✅ 올바른 시맨틱 구조
<header>
  <h1>페이지 제목</h1>
  <p>부제목</p>
</header>

<section aria-labelledby="section-heading">
  <h2 id="section-heading">섹션 제목</h2>
  {/* 내용 */}
</section>

// ❌ 잘못된 구조
<div>
  <h2>제목</h2> {/* H1 없이 H2 사용 */}
  <div>{/* 시맨틱 태그 없음 */}</div>
</div>
```

### 5. 접근성 (Accessibility)

```tsx
// ✅ 올바른 방법
<label htmlFor="birthDate">생년월일</label>
<input
  id="birthDate"
  aria-describedby="birthDate-help"
  aria-label="생년월일 입력"
/>
<p id="birthDate-help">생년월일을 선택하세요</p>

// 화면 읽기 전용 (스크린 리더용)
<h2 className="sr-only">섹션 제목</h2>
```

### 6. CSS 클래스 규칙

- Tailwind CSS 사용
- 반응형: `md:`, `lg:` 접두어 활용
- 재사용 가능한 스타일은 컴포넌트로 분리

---

## 📊 구조화된 데이터 (Schema.org) 가이드

### WebApplication Schema (도구 페이지)

```javascript
{
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '도구 이름',
  description: '도구 설명',
  url: '전체 URL',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
  aggregateRating: {  // 선택사항
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
}
```

### FAQPage Schema (FAQ 섹션)

```javascript
{
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '질문',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '답변',
      },
    },
    // 더 많은 FAQ...
  ],
}
```

### HowTo Schema (사용 방법)

```javascript
{
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '도구 사용 방법',
  description: '단계별 사용 가이드',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: '1단계',
      text: '설명',
    },
    // 더 많은 단계...
  ],
}
```

---

## 🧪 테스트 체크리스트

새 페이지를 추가한 후 반드시 확인:

### 기능 테스트
- [ ] 개발 서버에서 페이지가 정상 로드되는가? (`npm run dev`)
- [ ] 도구의 핵심 기능이 정상 작동하는가?
- [ ] 입력값 검증이 올바르게 동작하는가?
- [ ] 결과가 정확하게 표시되는가?

### UI/UX 테스트
- [ ] 모바일에서 레이아웃이 깨지지 않는가?
- [ ] 좌측 사이드바에 새 도구가 표시되는가?
- [ ] 홈페이지 카드에 새 도구가 표시되는가?
- [ ] 버튼 호버 효과가 작동하는가?

### SEO 테스트
- [ ] 페이지 소스 보기에서 `<title>` 태그 확인
- [ ] `<meta name="description">` 확인
- [ ] `<meta name="keywords">` 확인
- [ ] `<link rel="canonical">` 확인
- [ ] JSON-LD 스크립트 확인 (구조화된 데이터)

### 접근성 테스트
- [ ] Tab 키로 모든 인터랙티브 요소에 접근 가능한가?
- [ ] 스크린 리더로 읽었을 때 논리적 순서인가?
- [ ] 모든 입력 필드에 label이 있는가?

---

## 🚀 배포 전 최종 확인

```bash
# 1. 사이트맵 생성 확인
npm run generate-sitemap

# 2. 빌드 오류 확인
npm run build

# 3. 빌드된 사이트 미리보기
npm run preview

# 4. 모든 것이 정상이면 배포
npm run deploy
```

---

## 💡 실제 예시: 글자수 세기 도구 추가하기

### 1️⃣ 컴포넌트 생성

**파일**: `src/pages/tools/CharacterCounter.tsx`

```typescript
import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import { siteConfig } from '../../config/siteConfig';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  
  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'character-counter');

  // 통계 계산
  const stats = useMemo(() => ({
    total: text.length,
    noSpace: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    bytes: new Blob([text]).size,
  }), [text]);

  return (
    <>
      <SEO
        title={toolInfo?.title || '글자수 세기'}
        description={toolInfo?.description || ''}
        keywords={toolInfo?.keywords}
        canonical={toolInfo?.path}
      />

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            글자수 세기
          </h1>
          <p className="text-lg text-gray-600">
            공백 포함/제외 문자 수를 실시간으로 계산합니다
          </p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg resize-none"
            placeholder="텍스트를 입력하세요..."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">전체 글자</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{stats.noSpace}</div>
              <div className="text-sm text-gray-600 mt-1">공백 제외</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.words}</div>
              <div className="text-sm text-gray-600 mt-1">단어 수</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.bytes}</div>
              <div className="text-sm text-gray-600 mt-1">바이트</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
```

### 2️⃣ App.tsx에 추가

```typescript
import CharacterCounter from './pages/tools/CharacterCounter';

// Routes에 추가
<Route path="/tools/character-counter" element={<CharacterCounter />} />
```

### 3️⃣ siteConfig.ts에 추가

```typescript
{
  id: 'character-counter',
  path: '/tools/character-counter',
  title: '글자수 세기 - 공백 포함/제외 문자 수 계산',
  description: '텍스트의 글자 수, 단어 수, 바이트 수를 실시간으로 계산합니다. 공백 포함/제외 옵션 제공.',
  keywords: ['글자수 세기', '문자 수 계산', '바이트 계산', '단어 수', '공백 제외'],
  category: '텍스트',
}
```

### 4️⃣ 사이트맵에 추가

```javascript
{
  path: '/tools/character-counter',
  changefreq: 'weekly',
  priority: '0.9',
}
```

### 5️⃣ 배포

```bash
npm run deploy
```

완료! 🎉

---

## 📚 참고 자료

### 내부 문서
- `배포.md` - 배포 및 설정 가이드
- `README.md` - 프로젝트 개요

### 외부 문서
- [React 공식 문서](https://react.dev/)
- [React Router 공식 문서](https://reactrouter.com/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)
- [Schema.org 문서](https://schema.org/)
- [Google Search Console 가이드](https://developers.google.com/search/docs)

---

## ⚠️ 주의사항

### 하지 말아야 할 것

❌ H1 태그를 여러 개 사용하지 마세요
❌ SEO 컴포넌트 없이 페이지를 만들지 마세요
❌ siteConfig에 등록하지 않고 라우터만 추가하지 마세요
❌ 사이트맵 업데이트를 잊지 마세요
❌ 카테고리 없이 도구를 추가하지 마세요 (사이드바 그룹화 안 됨)

### 반드시 해야 할 것

✅ 5개 파일을 모두 수정하세요 (컴포넌트, App.tsx, siteConfig.ts, sitemap.mjs)
✅ SEO 메타 태그를 정확하게 설정하세요
✅ 접근성을 고려하세요 (label, aria-label 등)
✅ 모바일 반응형을 테스트하세요
✅ FAQ 섹션을 추가하세요 (SEO에 유리)

---

## 🎯 체크리스트 요약

새 페이지 추가 시 이 체크리스트를 따르세요:

```
[ ] 1. src/pages/tools/YourTool.tsx 생성
    [ ] SEO 컴포넌트 포함
    [ ] H1 태그 1개만 사용
    [ ] 구조화된 데이터 추가
    [ ] FAQ 섹션 추가
    
[ ] 2. src/App.tsx에 라우트 추가
    [ ] import 추가
    [ ] <Route> 추가
    
[ ] 3. src/config/siteConfig.ts에 도구 등록
    [ ] id 설정 (kebab-case)
    [ ] path 설정 (라우터와 동일)
    [ ] title (50-60자)
    [ ] description (150-160자)
    [ ] keywords (5-10개)
    [ ] category 설정
    
[ ] 4. scripts/generate-sitemap.mjs에 페이지 추가
    [ ] path 추가
    [ ] changefreq 설정
    [ ] priority 설정
    
[ ] 5. 테스트
    [ ] npm run dev로 로컬 확인
    [ ] 모바일 반응형 확인
    [ ] SEO 메타 태그 확인
    [ ] 사이드바에 표시 확인
    
[ ] 6. 배포
    [ ] npm run generate-sitemap
    [ ] npm run deploy
```

---

이 문서를 참조하여 정확하고 일관성 있는 새 페이지를 추가하세요! 🚀
