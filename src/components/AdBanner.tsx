import { useEffect, useRef } from 'react';
import { siteConfig } from '../config/siteConfig';

interface AdBannerProps {
  /**
   * 광고 슬롯 ID (AdSense에서 발급받은 슬롯 번호)
   */
  slot: string;
  /**
   * 광고 형식
   * - 'auto': 반응형 자동 크기
   * - 'rectangle': 사각형 (300x250)
   * - 'horizontal': 가로형 배너
   * - 'vertical': 세로형 배너
   */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  /**
   * 전체 너비 반응형 여부
   */
  fullWidthResponsive?: boolean;
  /**
   * 커스텀 스타일 클래스
   */
  className?: string;
}

/**
 * AdSense 광고 배너 컴포넌트
 * 
 * 사용법:
 * <AdBanner slot="1234567890" format="auto" />
 * 
 * 주의사항:
 * 1. AdSense 승인 전에는 광고가 표시되지 않습니다.
 * 2. siteConfig.adsense.enabled를 true로 변경해야 광고가 로드됩니다.
 * 3. 개발 환경에서는 광고가 표시되지 않습니다.
 */
export default function AdBanner({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  className = '',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // AdSense가 비활성화되어 있거나 이미 로드된 경우 스킵
    if (!siteConfig.adsense.enabled || isLoaded.current) {
      return;
    }

    // 개발 환경 체크
    if (import.meta.env.DEV) {
      console.log('[AdBanner] 개발 환경에서는 광고가 표시되지 않습니다.');
      return;
    }

    try {
      // adsbygoogle 배열이 없으면 생성
      const adsbygoogle = (window as any).adsbygoogle || [];
      
      // 광고 푸시
      adsbygoogle.push({});
      isLoaded.current = true;
    } catch (error) {
      console.error('[AdBanner] 광고 로드 실패:', error);
    }
  }, [slot]);

  // AdSense가 비활성화된 경우 플레이스홀더 표시 (개발용)
  if (!siteConfig.adsense.enabled) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={{ minHeight: '100px' }}
      >
        <span>광고 영역 (AdSense 승인 후 활성화)</span>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={siteConfig.adsense.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}

/**
 * AdSense 스크립트를 head에 삽입하는 컴포넌트
 * App.tsx 또는 Layout에서 한 번만 사용
 */
export function AdSenseScript() {
  useEffect(() => {
    if (!siteConfig.adsense.enabled || import.meta.env.DEV) {
      return;
    }

    // 이미 스크립트가 있는지 확인
    if (document.querySelector('script[src*="adsbygoogle"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      // 클린업 (필요시)
    };
  }, []);

  return null;
}
