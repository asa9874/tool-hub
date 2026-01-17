import { useState } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '영문 이름 변환기',
    description: '한글 이름을 여권/신용카드용 표준 영문 표기법으로 변환합니다',
    inputLabel: '한글 이름 입력',
    placeholder: '홍길동',
    convert: '변환하기',
    result: '영문 표기 결과',
    standard: '표준 로마자 표기법',
    passport: '여권용 표기',
    variants: '기타 표기 방식',
    copy: '복사',
    copied: '복사됨!',
    firstName: '이름 (First Name)',
    lastName: '성 (Last Name)',
    fullName: '전체 이름',
    tip: '💡 여권 발급 시 한 번 정한 영문 이름은 변경이 어려우니 신중하게 선택하세요.',
    note: '※ 실제 여권 발급 시에는 외교부 영문 성명 표기 기준을 확인하세요.',
  },
  en: {
    title: 'Korean Name Romanizer',
    description: 'Convert Korean names to standard romanization for passports and credit cards',
    inputLabel: 'Enter Korean Name',
    placeholder: '홍길동',
    convert: 'Convert',
    result: 'Romanization Results',
    standard: 'Standard Romanization',
    passport: 'Passport Style',
    variants: 'Other Variants',
    copy: 'Copy',
    copied: 'Copied!',
    firstName: 'First Name',
    lastName: 'Last Name',
    fullName: 'Full Name',
    tip: '💡 Choose carefully as passport names are difficult to change once registered.',
    note: '※ For actual passport issuance, please check the official romanization guidelines.',
  }
};

// 한글 자모 분리
const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 표준 로마자 표기
const CHO_ROMAN: Record<string, string> = {
  'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt',
  'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's',
  'ㅆ': 'ss', 'ㅇ': '', 'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch',
  'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h'
};

const JUNG_ROMAN: Record<string, string> = {
  'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo',
  'ㅔ': 'e', 'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa',
  'ㅙ': 'wae', 'ㅚ': 'oe', 'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo',
  'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅢ': 'ui', 'ㅣ': 'i'
};

const JONG_ROMAN: Record<string, string> = {
  '': '', 'ㄱ': 'k', 'ㄲ': 'k', 'ㄳ': 'k', 'ㄴ': 'n',
  'ㄵ': 'n', 'ㄶ': 'n', 'ㄷ': 't', 'ㄹ': 'l', 'ㄺ': 'k',
  'ㄻ': 'm', 'ㄼ': 'l', 'ㄽ': 'l', 'ㄾ': 'l', 'ㄿ': 'p',
  'ㅀ': 'l', 'ㅁ': 'm', 'ㅂ': 'p', 'ㅄ': 'p', 'ㅅ': 't',
  'ㅆ': 't', 'ㅇ': 'ng', 'ㅈ': 't', 'ㅊ': 't', 'ㅋ': 'k',
  'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 't'
};

// 흔한 성씨 표기
const FAMILY_NAMES: Record<string, string[]> = {
  '김': ['KIM', 'Kim'],
  '이': ['LEE', 'Lee', 'YI', 'Yi', 'RHEE'],
  '박': ['PARK', 'Park', 'PAK', 'BAHK'],
  '최': ['CHOI', 'Choi', 'CHOE'],
  '정': ['JUNG', 'Jung', 'JEONG', 'CHUNG'],
  '강': ['KANG', 'Kang', 'GANG'],
  '조': ['CHO', 'Cho', 'JO'],
  '윤': ['YOON', 'Yoon', 'YUN'],
  '장': ['JANG', 'Jang', 'CHANG'],
  '임': ['LIM', 'Lim', 'IM', 'YIM'],
  '한': ['HAN', 'Han'],
  '오': ['OH', 'Oh', 'O'],
  '서': ['SEO', 'Seo', 'SUH'],
  '신': ['SHIN', 'Shin', 'SIN'],
  '권': ['KWON', 'Kwon', 'GWON'],
  '황': ['HWANG', 'Hwang'],
  '안': ['AHN', 'Ahn', 'AN'],
  '송': ['SONG', 'Song'],
  '류': ['RYU', 'Ryu', 'YOO', 'YOU'],
  '유': ['YOO', 'Yoo', 'YOU', 'YU'],
  '홍': ['HONG', 'Hong'],
  '전': ['JEON', 'Jeon', 'CHUN', 'JUN'],
  '고': ['KO', 'Ko', 'GO'],
  '문': ['MOON', 'Moon', 'MUN'],
  '양': ['YANG', 'Yang'],
  '손': ['SON', 'Son', 'SOHN'],
  '배': ['BAE', 'Bae', 'PAE'],
  '백': ['BAEK', 'Baek', 'PAEK', 'BECK'],
  '허': ['HEO', 'Heo', 'HUH', 'HUR'],
  '노': ['NO', 'No', 'NOH', 'RO'],
};

function decomposeHangul(char: string): [string, string, string] | null {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return null;
  
  const offset = code - 0xAC00;
  const cho = Math.floor(offset / 588);
  const jung = Math.floor((offset % 588) / 28);
  const jong = offset % 28;
  
  return [CHO[cho], JUNG[jung], JONG[jong]];
}

function romanize(text: string): string {
  let result = '';
  
  for (const char of text) {
    const decomposed = decomposeHangul(char);
    if (decomposed) {
      const [cho, jung, jong] = decomposed;
      result += CHO_ROMAN[cho] + JUNG_ROMAN[jung] + JONG_ROMAN[jong];
    } else {
      result += char;
    }
  }
  
  return result;
}

export default function KoreanRomanizer() {
  const { t } = useLocalizedContent(i18n);
  const [name, setName] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const lastName = name.length > 0 ? name[0] : '';
  const firstName = name.length > 1 ? name.slice(1) : '';

  const lastNameRoman = FAMILY_NAMES[lastName]?.[0] || romanize(lastName).toUpperCase();
  const firstNameRoman = romanize(firstName).toUpperCase();

  const getVariants = () => {
    const variants: string[] = [];
    
    // 성씨 변형
    const lastVariants = FAMILY_NAMES[lastName] || [romanize(lastName).toUpperCase()];
    // 이름은 표준 표기만
    const firstStandard = romanize(firstName);
    
    lastVariants.forEach(lastV => {
      variants.push(`${lastV} ${firstStandard.charAt(0).toUpperCase()}${firstStandard.slice(1).toLowerCase()}`);
    });
    
    return [...new Set(variants)].slice(0, 6);
  };

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inputLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.placeholder}
              className="w-full p-4 text-2xl text-center border rounded-lg"
              maxLength={5}
            />
          </div>

          {name.length >= 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">{t.result}</h2>

              {/* 표준 표기 */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 mb-2">{t.standard}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">{t.lastName}</p>
                    <p className="text-xl font-bold">{lastNameRoman}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t.firstName}</p>
                    <p className="text-xl font-bold">{firstNameRoman}</p>
                  </div>
                </div>
              </div>

              {/* 여권용 */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-green-600 mb-1">{t.passport}</p>
                    <p className="text-2xl font-bold font-mono">
                      {lastNameRoman} {firstNameRoman}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${lastNameRoman} ${firstNameRoman}`, 0)}
                    className={`px-3 py-1 rounded ${
                      copiedIndex === 0 ? 'bg-green-500 text-white' : 'bg-green-200 hover:bg-green-300'
                    }`}
                  >
                    {copiedIndex === 0 ? t.copied : t.copy}
                  </button>
                </div>
              </div>

              {/* 다른 표기법 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">{t.variants}</p>
                <div className="space-y-2">
                  {getVariants().map((variant, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-mono">{variant}</span>
                      <button
                        onClick={() => copyToClipboard(variant, i + 1)}
                        className={`px-2 py-1 text-sm rounded ${
                          copiedIndex === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {copiedIndex === i + 1 ? t.copied : t.copy}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 안내 */}
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">{t.tip}</p>
                <p className="text-xs text-yellow-600 mt-2">{t.note}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
