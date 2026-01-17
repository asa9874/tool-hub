import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

/**
 * 개인정보처리방침 페이지
 * - AdSense 승인을 위해 필수
 * - 법적 요구사항 충족
 * - 다국어 지원
 */
export default function PrivacyPolicy() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';
  const lastUpdated = isKorean ? '2026년 1월 18일' : 'January 18, 2026';

  return (
    <>
      <SEO
        title={isKorean ? '개인정보처리방침' : 'Privacy Policy'}
        description={isKorean 
          ? 'ToolHub의 개인정보처리방침입니다. 사용자의 개인정보 수집, 이용, 보호에 관한 내용을 안내합니다.'
          : "ToolHub's Privacy Policy. Learn about how we handle user data collection, usage, and protection."
        }
        canonical="/privacy-policy"
        noindex={false}
      />

      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-lg p-6 md:p-10">
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isKorean ? '개인정보처리방침' : 'Privacy Policy'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isKorean ? `최종 수정일: ${lastUpdated}` : `Last updated: ${lastUpdated}`}
            </p>
          </header>

          <div className="prose prose-gray max-w-none">
            {isKorean ? (
              <KoreanContent />
            ) : (
              <EnglishContent />
            )}
          </div>
        </article>
      </div>
    </>
  );
}

function KoreanContent() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          1. 개인정보의 수집 및 이용 목적
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          ToolHub(이하 "서비스")는 GitHub Pages를 통해 제공되는 완전한 정적 웹사이트입니다.
          본 서비스는 별도의 서버를 운영하지 않으며, <strong>사용자의 개인정보를 직접 수집하거나 저장하지 않습니다</strong>.
        </p>
        <p className="text-gray-600 leading-relaxed">
          다만, 서비스 개선 및 광고 제공을 위해 Google Analytics 및 Google AdSense와 같은 
          제3자 서비스를 이용할 수 있으며, 이들 서비스가 쿠키를 통해 정보를 수집할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          2. 수집하는 개인정보의 항목
        </h2>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          2.1 서비스가 직접 수집하는 정보
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          <strong>없음</strong> - 본 서비스는 회원가입이 없으며, 사용자가 입력한 어떠한 정보도 
          서버로 전송하거나 저장하지 않습니다.
        </p>
        
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          2.2 브라우저에서만 처리되는 정보
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          본 서비스에서 제공하는 모든 도구(만나이 계산기, 글자수 세기 등)는 
          <strong>사용자의 브라우저에서만 작동</strong>하며, 입력한 데이터(생년월일, 텍스트 등)는 
          절대 외부로 전송되지 않습니다.
        </p>
        
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          2.3 제3자 서비스가 수집할 수 있는 정보
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          다음 제3자 서비스들이 자동으로 정보를 수집할 수 있습니다:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
          <li><strong>GitHub Pages:</strong> 접속 IP 주소, 접속 시간, 브라우저 정보 등</li>
          <li><strong>Google Analytics:</strong> 방문 페이지, 체류 시간, 유입 경로, 기기 정보 등</li>
          <li><strong>Google AdSense:</strong> 광고 표시 및 클릭 정보, 쿠키 기반 사용자 관심사</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          3. 쿠키(Cookie) 사용
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          서비스는 사용자 경험 향상 및 통계 분석을 위해 쿠키를 사용할 수 있습니다.
          쿠키는 브라우저 설정을 통해 언제든지 삭제할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          4. 문의
        </h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">
            <strong>이메일:</strong> pjkpjk1129@gmail.com
          </p>
        </div>
      </section>

      <section className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 중요 안내
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>본 서비스는 GitHub Pages로 제공되는 <strong>완전한 정적 웹사이트</strong>입니다.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>별도의 백엔드 서버나 데이터베이스를 운영하지 않습니다.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>사용자가 입력한 모든 데이터는 <strong>브라우저에서만 처리</strong>되며 외부로 전송되지 않습니다.</span>
          </li>
        </ul>
      </section>
    </>
  );
}

function EnglishContent() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          1. Purpose of Collecting and Using Personal Information
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          ToolHub (the "Service") is a fully static website provided through GitHub Pages.
          This service does not operate a separate server and <strong>does not directly collect or store users' personal information</strong>.
        </p>
        <p className="text-gray-600 leading-relaxed">
          However, we may use third-party services such as Google Analytics and Google AdSense for service improvement and advertising,
          and these services may collect information through cookies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          2. Categories of Personal Information Collected
        </h2>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          2.1 Information Directly Collected by the Service
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          <strong>None</strong> - This service has no user registration, and no information entered by users is transmitted to or stored on any server.
        </p>
        
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          2.2 Information Processed Only in the Browser
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          All tools provided by this service (age calculator, character counter, etc.) 
          <strong>operate only in the user's browser</strong>, and entered data (birthdate, text, etc.) 
          is never transmitted externally.
        </p>
        
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          2.3 Information That May Be Collected by Third-Party Services
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          The following third-party services may automatically collect information:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
          <li><strong>GitHub Pages:</strong> IP address, access time, browser information, etc.</li>
          <li><strong>Google Analytics:</strong> Pages visited, session duration, referral source, device information, etc.</li>
          <li><strong>Google AdSense:</strong> Ad display and click information, cookie-based user interests</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          3. Use of Cookies
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The service may use cookies to improve user experience and analyze statistics.
          Cookies can be deleted at any time through browser settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          4. Contact
        </h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">
            <strong>Email:</strong> pjkpjk1129@gmail.com
          </p>
        </div>
      </section>

      <section className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 Important Notice
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>This service is a <strong>fully static website</strong> provided through GitHub Pages.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>We do not operate any backend servers or databases.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>All data entered by users is <strong>processed only in the browser</strong> and is never transmitted externally.</span>
          </li>
        </ul>
      </section>
    </>
  );
}
