// 사이트 전역 설정 - 배포 전 실제 도메인으로 변경 필요
export const siteConfig = {
  // GitHub Pages 배포 시 사용할 기본 URL (예: https://username.github.io/tool-hub)
  siteUrl: 'https://asa9874.github.io/tool-hub',
  siteName: 'ToolHub - 무료 온라인 도구 모음',
  siteDescription: '만나이 계산기, 글자수 세기, 단위 변환기 등 다양한 무료 온라인 도구를 제공합니다.',
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
    {
      id: 'age-calculator',
      path: '/tools/age-calculator',
      title: '만나이 계산기 - 정확한 나이 계산',
      description: '생년월일을 입력하면 만나이, 한국식 나이, 연나이를 정확하게 계산해드립니다. 2023년 만나이 통일법 적용.',
      keywords: ['만나이 계산기', '나이 계산', '한국 나이', '만나이 통일법', '생년월일 계산'],
      category: '계산기',
    },
    {
      id: 'character-counter',
      path: '/tools/character-counter',
      title: '글자수 세기 - 공백 포함/제외 문자 수 계산',
      description: '텍스트의 글자 수, 단어 수, 바이트 수를 실시간으로 계산합니다. 공백 포함/제외 옵션 제공.',
      keywords: ['글자수 세기', '문자 수 계산', '바이트 계산', '단어 수'],
      category: '텍스트',
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
