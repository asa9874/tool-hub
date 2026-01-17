import SEO from '../components/SEO';

/**
 * 개인정보처리방침 페이지
 * - AdSense 승인을 위해 필수
 * - 법적 요구사항 충족
 */
export default function PrivacyPolicy() {
  const lastUpdated = '2026년 1월 17일';

  return (
    <>
      <SEO
        title="개인정보처리방침"
        description="ToolHub의 개인정보처리방침입니다. 사용자의 개인정보 수집, 이용, 보호에 관한 내용을 안내합니다."
        canonical="/privacy-policy"
        noindex={false}
      />

      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-lg p-6 md:p-10">
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              개인정보처리방침
            </h1>
            <p className="text-gray-500 text-sm">
              최종 수정일: {lastUpdated}
            </p>
          </header>

          <div className="prose prose-gray max-w-none">
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
              <p className="text-gray-600 leading-relaxed mt-4">
                이러한 정보는 각 서비스 제공자의 개인정보처리방침에 따라 처리됩니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. 개인정보의 보유 및 이용 기간
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                본 서비스는 개인정보를 직접 보유하지 않습니다.
              </p>
              <p className="text-gray-600 leading-relaxed">
                제3자 서비스(Google Analytics, AdSense 등)가 수집하는 정보의 보유 기간은 
                해당 서비스의 정책에 따릅니다. 쿠키는 브라우저 설정을 통해 언제든지 삭제할 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. 개인정보의 제3자 제공
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                본 서비스는 사용자의 개인정보를 직접 수집하지 않으므로, 제3자에게 제공할 개인정보가 없습니다.
              </p>
              <p className="text-gray-600 leading-relaxed">
                다만, 다음 제3자 서비스들이 독립적으로 정보를 수집하고 처리합니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-4">
                <li>GitHub Pages (호스팅 제공)</li>
                <li>Google Analytics (방문 통계 분석)</li>
                <li>Google AdSense (광고 제공)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                5. 쿠키(Cookie) 사용
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                서비스는 사용자 경험 향상 및 통계 분석을 위해 쿠키를 사용할 수 있습니다.
              </p>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                쿠키 사용 목적
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>사용자 설정 저장 (테마, 언어 등)</li>
                <li>Google Analytics를 통한 방문 통계 수집</li>
                <li>Google AdSense를 통한 맞춤형 광고 제공</li>
              </ul>
              <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                쿠키 거부 방법
              </h3>
              <p className="text-gray-600 leading-relaxed">
                사용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
                다만, 쿠키를 거부할 경우 서비스 이용에 일부 제한이 있을 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                6. 광고 서비스
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                서비스는 Google AdSense를 통해 광고를 게재합니다. 
                Google은 사용자의 관심사에 기반한 맞춤 광고를 제공하기 위해 
                쿠키를 사용할 수 있습니다.
              </p>
              <p className="text-gray-600 leading-relaxed">
                맞춤 광고를 원하지 않는 경우, 
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google 광고 설정
                </a>
                에서 비활성화할 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                7. 개인정보 보호를 위한 기술적 조치
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                본 서비스는 GitHub Pages를 통해 HTTPS로 제공되며, 다음과 같은 보안 조치를 취하고 있습니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>HTTPS 암호화:</strong> 모든 통신은 TLS/SSL로 암호화됩니다</li>
                <li><strong>클라이언트 사이드 처리:</strong> 모든 데이터는 브라우저에서만 처리되며 외부로 전송되지 않습니다</li>
                <li><strong>서버 없는 구조:</strong> 백엔드 서버가 없어 데이터 유출 위험이 근본적으로 차단됩니다</li>
                <li><strong>최소 정보 수집:</strong> 서비스 운영에 필요한 최소한의 정보만 제3자 서비스를 통해 수집됩니다</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                8. 사용자의 권리
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                본 서비스는 개인정보를 직접 수집하지 않으므로, 
                제3자 서비스(Google)에서 수집한 정보에 대한 권리는 각 서비스를 통해 행사하실 수 있습니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>
                  <strong>Google 계정 정보 관리:</strong>{' '}
                  <a 
                    href="https://myaccount.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google 계정 설정
                  </a>
                </li>
                <li>
                  <strong>Google Analytics 옵트아웃:</strong>{' '}
                  <a 
                    href="https://tools.google.com/dlpage/gaoptout" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Analytics 차단 브라우저 추가기능
                  </a>
                </li>
                <li>
                  <strong>맞춤 광고 비활성화:</strong>{' '}
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google 광고 설정
                  </a>
                </li>
                <li><strong>브라우저 쿠키 삭제:</strong> 브라우저 설정에서 쿠키를 직접 삭제할 수 있습니다</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                9. 제3자 서비스 정보
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                본 서비스에서 사용하는 제3자 서비스들의 개인정보처리방침은 다음과 같습니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>
                  <strong>GitHub Pages:</strong>{' '}
                  <a 
                    href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    GitHub 개인정보처리방침
                  </a>
                </li>
                <li>
                  <strong>Google Analytics:</strong>{' '}
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google 개인정보처리방침
                  </a>
                </li>
                <li>
                  <strong>Google AdSense:</strong>{' '}
                  <a 
                    href="https://policies.google.com/technologies/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google 광고 정책
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                10. 문의 및 연락처
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>이메일:</strong> pjkpjk1129@gmail.com
                </p>
                <p className="text-gray-700 mt-2 text-sm">
                  (본 서비스는 서버를 운영하지 않는 정적 웹사이트이므로, 
                  개인정보 관련 문의는 제한적일 수 있습니다)
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                11. 개인정보처리방침의 변경
              </h2>
              <p className="text-gray-600 leading-relaxed">
                이 개인정보처리방침은 법령 또는 서비스 변경에 따라 수정될 수 있습니다. 
                변경 시 본 페이지를 통해 공지하며, 변경된 방침은 공지한 날로부터 
                7일 후에 효력이 발생합니다.
              </p>
            </section>

            {/* 추가 안내 */}
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
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>개인정보 수집은 Google Analytics 및 AdSense 등 제3자 서비스에 의해서만 이루어집니다.</span>
                </li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
