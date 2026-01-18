import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';
import { siteConfig } from '../../config/siteConfig';

interface SizeSpec {
  name: string;
  nameKo: string;
  width: number;
  height: number;
  aspectRatio?: string;
  note?: string;
  noteKo?: string;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  sizes: SizeSpec[];
}

export default function SocialMediaSizeGuide() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';
  
  const toolInfo = siteConfig.tools.find(tool => tool.id === 'social-media-size-guide');
  
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  
  // 2026년 최신 소셜 미디어 사이즈 가이드
  const platforms: Platform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      color: 'from-purple-500 to-pink-500',
      sizes: [
        { name: 'Profile Photo', nameKo: '프로필 사진', width: 320, height: 320, aspectRatio: '1:1' },
        { name: 'Square Post', nameKo: '정사각 게시물', width: 1080, height: 1080, aspectRatio: '1:1' },
        { name: 'Portrait Post', nameKo: '세로 게시물', width: 1080, height: 1350, aspectRatio: '4:5' },
        { name: 'Landscape Post', nameKo: '가로 게시물', width: 1080, height: 566, aspectRatio: '1.91:1' },
        { name: 'Story / Reels', nameKo: '스토리 / 릴스', width: 1080, height: 1920, aspectRatio: '9:16' },
        { name: 'Carousel', nameKo: '캐러셀', width: 1080, height: 1080, aspectRatio: '1:1', note: 'Up to 10 slides', noteKo: '최대 10장' },
        { name: 'IGTV Cover', nameKo: 'IGTV 커버', width: 420, height: 654, aspectRatio: '1:1.55' },
      ],
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '▶️',
      color: 'from-red-500 to-red-600',
      sizes: [
        { name: 'Channel Profile', nameKo: '채널 프로필', width: 800, height: 800, aspectRatio: '1:1' },
        { name: 'Channel Banner', nameKo: '채널 배너', width: 2560, height: 1440, aspectRatio: '16:9', note: 'Safe area: 1546x423', noteKo: '안전 영역: 1546x423' },
        { name: 'Video Thumbnail', nameKo: '썸네일', width: 1280, height: 720, aspectRatio: '16:9' },
        { name: 'Shorts', nameKo: '쇼츠', width: 1080, height: 1920, aspectRatio: '9:16' },
        { name: 'Video Upload', nameKo: '영상 업로드', width: 3840, height: 2160, aspectRatio: '16:9', note: '4K recommended', noteKo: '4K 권장' },
        { name: 'End Screen', nameKo: '종료 화면', width: 1280, height: 720, aspectRatio: '16:9' },
      ],
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      color: 'from-black to-gray-800',
      sizes: [
        { name: 'Profile Photo', nameKo: '프로필 사진', width: 200, height: 200, aspectRatio: '1:1' },
        { name: 'Video', nameKo: '동영상', width: 1080, height: 1920, aspectRatio: '9:16' },
        { name: 'Photo Post', nameKo: '사진 게시물', width: 1080, height: 1920, aspectRatio: '9:16' },
        { name: 'Carousel', nameKo: '캐러셀', width: 1080, height: 1920, aspectRatio: '9:16', note: 'Up to 35 slides', noteKo: '최대 35장' },
      ],
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👤',
      color: 'from-blue-500 to-blue-600',
      sizes: [
        { name: 'Profile Photo', nameKo: '프로필 사진', width: 170, height: 170, aspectRatio: '1:1', note: 'Min 180x180', noteKo: '최소 180x180' },
        { name: 'Cover Photo', nameKo: '커버 사진', width: 820, height: 312, aspectRatio: '2.63:1' },
        { name: 'Shared Image', nameKo: '공유 이미지', width: 1200, height: 630, aspectRatio: '1.91:1' },
        { name: 'Event Cover', nameKo: '이벤트 커버', width: 1920, height: 1005, aspectRatio: '1.91:1' },
        { name: 'Story', nameKo: '스토리', width: 1080, height: 1920, aspectRatio: '9:16' },
        { name: 'Reels', nameKo: '릴스', width: 1080, height: 1920, aspectRatio: '9:16' },
        { name: 'Ad Image', nameKo: '광고 이미지', width: 1200, height: 628, aspectRatio: '1.91:1' },
      ],
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: '𝕏',
      color: 'from-gray-800 to-black',
      sizes: [
        { name: 'Profile Photo', nameKo: '프로필 사진', width: 400, height: 400, aspectRatio: '1:1' },
        { name: 'Header Photo', nameKo: '헤더 사진', width: 1500, height: 500, aspectRatio: '3:1' },
        { name: 'In-Stream Photo', nameKo: '인라인 이미지', width: 1600, height: 900, aspectRatio: '16:9' },
        { name: 'Card Image', nameKo: '카드 이미지', width: 1200, height: 628, aspectRatio: '1.91:1' },
        { name: 'Fleets', nameKo: '플릿', width: 1080, height: 1920, aspectRatio: '9:16' },
      ],
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: 'from-blue-600 to-blue-700',
      sizes: [
        { name: 'Profile Photo', nameKo: '프로필 사진', width: 400, height: 400, aspectRatio: '1:1' },
        { name: 'Background Photo', nameKo: '배경 사진', width: 1584, height: 396, aspectRatio: '4:1' },
        { name: 'Company Logo', nameKo: '회사 로고', width: 300, height: 300, aspectRatio: '1:1' },
        { name: 'Company Cover', nameKo: '회사 커버', width: 1128, height: 191, aspectRatio: '5.9:1' },
        { name: 'Shared Image', nameKo: '공유 이미지', width: 1200, height: 627, aspectRatio: '1.91:1' },
        { name: 'Blog Post Image', nameKo: '블로그 이미지', width: 1200, height: 644, aspectRatio: '1.86:1' },
      ],
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: '📌',
      color: 'from-red-600 to-red-700',
      sizes: [
        { name: 'Profile Photo', nameKo: '프로필 사진', width: 165, height: 165, aspectRatio: '1:1' },
        { name: 'Standard Pin', nameKo: '표준 핀', width: 1000, height: 1500, aspectRatio: '2:3' },
        { name: 'Square Pin', nameKo: '정사각 핀', width: 1000, height: 1000, aspectRatio: '1:1' },
        { name: 'Long Pin', nameKo: '세로 핀', width: 1000, height: 2100, aspectRatio: '1:2.1' },
        { name: 'Idea Pin', nameKo: '아이디어 핀', width: 1080, height: 1920, aspectRatio: '9:16' },
        { name: 'Board Cover', nameKo: '보드 커버', width: 222, height: 150, aspectRatio: '1.48:1' },
      ],
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: '🧵',
      color: 'from-gray-900 to-black',
      sizes: [
        { name: 'Profile Photo', nameKo: '프로필 사진', width: 320, height: 320, aspectRatio: '1:1' },
        { name: 'Square Image', nameKo: '정사각 이미지', width: 1080, height: 1080, aspectRatio: '1:1' },
        { name: 'Portrait Image', nameKo: '세로 이미지', width: 1080, height: 1350, aspectRatio: '4:5' },
        { name: 'Landscape Image', nameKo: '가로 이미지', width: 1080, height: 566, aspectRatio: '1.91:1' },
      ],
    },
  ];
  
  const currentPlatform = platforms.find(p => p.id === selectedPlatform);
  
  // 검색 필터링
  const filteredSizes = currentPlatform?.sizes.filter(size => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      size.name.toLowerCase().includes(query) ||
      size.nameKo.toLowerCase().includes(query) ||
      `${size.width}x${size.height}`.includes(query)
    );
  });
  
  // 크기 복사
  const copySize = (size: SizeSpec) => {
    const text = `${size.width} x ${size.height}`;
    navigator.clipboard.writeText(text);
    setCopied(`${size.width}x${size.height}`);
    setTimeout(() => setCopied(null), 2000);
  };
  
  return (
    <>
      <SEO
        title={toolInfo?.title || '소셜 미디어 사이즈 가이드 (2026)'}
        description={toolInfo?.description || '각 소셜 미디어 플랫폼의 권장 이미지 사이즈를 확인하세요'}
        keywords={toolInfo?.keywords || []}
      />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {isKorean ? '📱 소셜 미디어 사이즈 가이드' : '📱 Social Media Size Guide'}
            </h1>
            <span className="px-3 py-1 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-medium rounded-full">
              2026
            </span>
          </div>
          <p className="text-gray-600">
            {isKorean 
              ? '인스타그램, 유튜브, 틱톡 등 주요 소셜 미디어 플랫폼의 최신 권장 이미지 사이즈를 확인하세요.'
              : 'Check the latest recommended image sizes for major social media platforms.'}
          </p>
        </div>
        
        {/* 플랫폼 선택 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  selectedPlatform === platform.id
                    ? `bg-gradient-to-r ${platform.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{platform.icon}</span>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* 검색 */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isKorean ? '사이즈 또는 용도 검색 (예: 썸네일, 1080x1080)' : 'Search by size or purpose (e.g., thumbnail, 1080x1080)'}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* 사이즈 목록 */}
        {currentPlatform && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-2 rounded-xl bg-gradient-to-r ${currentPlatform.color} text-white font-semibold flex items-center gap-2`}>
                <span className="text-xl">{currentPlatform.icon}</span>
                {currentPlatform.name}
              </span>
              <span className="text-gray-500">
                {filteredSizes?.length} {isKorean ? '개 사이즈' : 'sizes'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSizes?.map((size, index) => (
                <div
                  key={index}
                  className="group p-4 border border-gray-200 rounded-xl hover:border-fuchsia-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => copySize(size)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {isKorean ? size.nameKo : size.name}
                      </h4>
                      {(isKorean ? size.noteKo : size.note) && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {isKorean ? size.noteKo : size.note}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-fuchsia-500 transition-colors">
                      {copied === `${size.width}x${size.height}` ? '✓ Copied!' : isKorean ? '클릭하여 복사' : 'Click to copy'}
                    </span>
                  </div>
                  
                  {/* 비율 미리보기 */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`bg-gradient-to-br ${currentPlatform.color} rounded-lg flex items-center justify-center text-white text-xs font-medium`}
                      style={{
                        width: Math.min(80, size.width / 20),
                        height: Math.min(80, size.height / 20),
                        minWidth: '40px',
                        minHeight: '30px',
                      }}
                    >
                      {size.aspectRatio}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {size.width} <span className="text-gray-400">×</span> {size.height}
                      </p>
                      <p className="text-sm text-gray-500">
                        {size.aspectRatio && `${isKorean ? '비율' : 'Ratio'}: ${size.aspectRatio}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 퀵 레퍼런스 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 {isKorean ? '빠른 비교표' : 'Quick Reference'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {isKorean ? '플랫폼' : 'Platform'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {isKorean ? '프로필' : 'Profile'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {isKorean ? '피드/게시물' : 'Feed/Post'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {isKorean ? '스토리/숏폼' : 'Story/Short'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((platform) => {
                  const profile = platform.sizes.find(s => s.name.toLowerCase().includes('profile'));
                  const post = platform.sizes.find(s => 
                    s.name.toLowerCase().includes('post') || 
                    s.name.toLowerCase().includes('shared') ||
                    s.name.toLowerCase().includes('thumbnail')
                  );
                  const story = platform.sizes.find(s => 
                    s.name.toLowerCase().includes('story') || 
                    s.name.toLowerCase().includes('reel') ||
                    s.name.toLowerCase().includes('short') ||
                    s.name.toLowerCase().includes('video')
                  );
                  
                  return (
                    <tr key={platform.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-2">
                          <span>{platform.icon}</span>
                          <span className="font-medium">{platform.name}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {profile ? `${profile.width}×${profile.height}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {post ? `${post.width}×${post.height}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {story ? `${story.width}×${story.height}` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 팁 */}
        <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            💡 {isKorean ? '사이즈 최적화 팁' : 'Size Optimization Tips'}
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• {isKorean 
              ? '권장 사이즈보다 약간 크게 제작하면 품질 손실 없이 다운샘플링됩니다.'
              : 'Create slightly larger than recommended for quality downsampling.'}
            </li>
            <li>• {isKorean 
              ? '정사각형(1:1) 이미지는 대부분의 플랫폼에서 안전하게 사용할 수 있습니다.'
              : 'Square (1:1) images work safely on most platforms.'}
            </li>
            <li>• {isKorean 
              ? '세로형(9:16) 콘텐츠가 숏폼 플랫폼에서 가장 높은 참여율을 보입니다.'
              : 'Vertical (9:16) content shows highest engagement on short-form platforms.'}
            </li>
            <li>• {isKorean 
              ? 'WebP 또는 AVIF 포맷을 사용하면 파일 크기를 크게 줄일 수 있습니다.'
              : 'Use WebP or AVIF format to significantly reduce file size.'}
            </li>
            <li>• {isKorean 
              ? '플랫폼별 가이드라인은 수시로 변경되니 정기적으로 확인하세요.'
              : 'Platform guidelines change frequently, check regularly.'}
            </li>
          </ul>
        </div>
        
        {/* 업데이트 정보 */}
        <div className="text-center text-sm text-gray-500">
          {isKorean 
            ? '마지막 업데이트: 2026년 1월 | 각 플랫폼의 공식 가이드라인을 참고하세요.'
            : 'Last updated: January 2026 | Please refer to official platform guidelines.'}
        </div>
      </div>
    </>
  );
}
