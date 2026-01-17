// 사이트 전역 설정 - 배포 전 실제 도메인으로 변경 필요
export const siteConfig = {
  // GitHub Pages 배포 시 사용할 기본 URL (예: https://username.github.io/tool-hub)
  siteUrl: 'https://asa9874.github.io/tool-hub',
  siteName: 'ToolHub - 무료 온라인 도구 모음',
  siteDescription: '만나이 계산기, 전역일 계산기, 글자수 세기, JSON 포맷터 등 다양한 무료 온라인 도구를 제공합니다.',
  defaultLanguage: 'ko',
  
  // AdSense 설정 (승인 후 실제 값으로 변경)
  adsense: {
    clientId: 'ca-pub-XXXXXXXXXXXXXXXX', // 실제 AdSense 클라이언트 ID로 변경
    enabled: false, // 승인 후 true로 변경
  },
  
  // 소셜 미디어 (선택사항)
  social: {
    twitter: '',
    github: '',
  },

  // 도구 목록 - 새 도구 추가 시 여기에 등록
  tools: [
    // === 생활/사회 분야 ===
    {
      id: 'age-calculator',
      path: '/tools/age-calculator',
      title: '2026년 만나이 계산기 - 정확한 나이 계산 (만나이 통일법 적용)',
      description: '생년월일을 입력하면 만나이, 한국식 나이, 연나이를 정확하게 계산해드립니다. 2023년 6월 만나이 통일법 적용.',
      keywords: ['만나이 계산기', '나이 계산', '한국 나이', '만나이 통일법', '생년월일 계산', '2026년 나이'],
      category: '생활/사회',
    },
    {
      id: 'military-calculator',
      path: '/tools/military-calculator',
      title: '전역일 계산기 - 육군/해군/공군 복무일수 계산 (2026년)',
      description: '입대일을 입력하면 전역일, 복무한 일수, 남은 일수를 정확하게 계산합니다. 육군, 해군, 공군, 사회복무요원 지원.',
      keywords: ['전역일 계산기', '군대 전역일', '복무일수 계산', '육군 전역일', '공군 전역일', '해군 전역일'],
      category: '생활/사회',
    },
    {
      id: 'gpa-calculator',
      path: '/tools/gpa-calculator',
      title: '대학교 학점 계산기 - 평균 평점(GPA) 계산 (4.5 만점)',
      description: '과목별 학점과 성적을 입력하면 평균 학점(GPA)을 자동으로 계산합니다. 4.5 만점 기준.',
      keywords: ['학점 계산기', 'GPA 계산', '평균 학점', '대학 학점', '성적 계산'],
      category: '생활/사회',
    },
    {
      id: 'salary-calculator',
      path: '/tools/salary-calculator',
      title: '2026년 실수령액 계산기 - 연봉 세후 월급 계산',
      description: '연봉 입력 시 4대 보험과 소득세를 제외한 실제 월급(실수령액)을 계산합니다. 2024년 세율 기준.',
      keywords: ['실수령액 계산기', '연봉 계산기', '월급 계산', '세후 월급', '4대 보험 계산'],
      category: '생활/사회',
    },
    {
      id: 'zodiac-calculator',
      path: '/tools/zodiac-calculator',
      title: '띠 & 별자리 계산기 - 12간지, 생일 별자리 확인',
      description: '생년월일로 띠(12간지)와 별자리를 확인하세요. 다음 생일까지 며칠 남았는지도 알려드립니다.',
      keywords: ['띠 계산기', '별자리 계산기', '12간지', '생일 별자리', '다음 생일'],
      category: '생활/사회',
    },
    {
      id: 'd-day-calculator',
      path: '/tools/d-day-calculator',
      title: 'D-Day 계산기 - 기념일, 시험일까지 남은 일수',
      description: '특정 날짜까지 남은 일수(D-Day)를 계산합니다. 기념일, 시험, 여행 등 중요한 날까지 D-Day 확인.',
      keywords: ['D-Day 계산기', '디데이 계산', '남은 일수', '기념일 계산', '100일 계산'],
      category: '생활/사회',
    },
    
    // === 업무/생산성 분야 ===
    {
      id: 'character-counter',
      path: '/tools/character-counter',
      title: '자기소개서 글자수 세기 - 공백 포함/제외 실시간 계산',
      description: '텍스트의 글자 수, 단어 수, 바이트 수를 실시간으로 계산합니다. 자기소개서, 이력서 작성 시 유용.',
      keywords: ['글자수 세기', '자기소개서 글자수', '문자 수 계산', '바이트 계산', '공백 포함'],
      category: '업무/생산성',
    },
    {
      id: 'percent-calculator',
      path: '/tools/percent-calculator',
      title: '퍼센트 계산기 - 비율, 할인율, 증감률 계산',
      description: '퍼센트(%) 계산을 쉽게! A의 B%는? 증감률은? 할인가는? 다양한 퍼센트 계산을 지원합니다.',
      keywords: ['퍼센트 계산기', '비율 계산', '할인율 계산', '증감률 계산', '% 계산'],
      category: '업무/생산성',
    },
    {
      id: 'unit-converter',
      path: '/tools/unit-converter',
      title: '단위 변환기 - 길이/면적/무게/온도 변환 (평수↔제곱미터)',
      description: '평수를 제곱미터로, 인치를 센티미터로! 길이, 면적, 무게, 온도, 데이터 용량 단위를 쉽게 변환.',
      keywords: ['단위 변환기', '평수 계산', '제곱미터', '인치 센티미터', '단위 환산'],
      category: '업무/생산성',
    },
    
    // === 개발/IT 분야 ===
    {
      id: 'json-formatter',
      path: '/tools/json-formatter',
      title: 'JSON Formatter & Validator - JSON 정렬/검증 도구',
      description: 'JSON 코드를 예쁘게 정렬(Pretty Print)하고 문법 오류를 검사합니다. 개발자 필수 도구.',
      keywords: ['JSON 포맷터', 'JSON 정렬', 'JSON 검증', 'JSON validator', 'Pretty Print'],
      category: '개발/IT',
    },
    {
      id: 'base64',
      path: '/tools/base64',
      title: 'Base64 인코더/디코더 - 텍스트 Base64 변환',
      description: '텍스트를 Base64로 인코딩하거나 Base64를 원본 텍스트로 디코딩합니다. UTF-8 한글 지원.',
      keywords: ['Base64 인코딩', 'Base64 디코딩', 'Base64 변환', '인코더', '디코더'],
      category: '개발/IT',
    },
    {
      id: 'url-encoder',
      path: '/tools/url-encoder',
      title: 'URL 인코더/디코더 - 한글 URL 퍼센트 인코딩',
      description: 'URL에 포함된 한글, 특수문자를 안전하게 인코딩하거나 디코딩합니다. encodeURI/encodeURIComponent.',
      keywords: ['URL 인코딩', 'URL 디코딩', '퍼센트 인코딩', 'encodeURI', 'URL 변환'],
      category: '개발/IT',
    },
    {
      id: 'lorem-ipsum',
      path: '/tools/lorem-ipsum',
      title: 'Lorem Ipsum 생성기 - 더미 텍스트 생성',
      description: '웹사이트, 앱, 문서 디자인에 사용할 더미 텍스트(Lorem Ipsum)를 문단/문장/단어 단위로 생성.',
      keywords: ['Lorem Ipsum', '더미 텍스트', '로렘 입숨', '테스트 텍스트', 'placeholder text'],
      category: '개발/IT',
    },
  ],
};

// 도구 정보 타입
export interface ToolInfo {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
}
