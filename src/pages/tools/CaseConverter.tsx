import { useState } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '텍스트 대소문자 변환기',
    description: '영문 텍스트를 대문자, 소문자, 제목형 등 다양한 형식으로 한 번에 변환합니다',
    inputLabel: '변환할 텍스트 입력',
    placeholder: 'Enter your text here...',
    uppercase: '대문자 (UPPERCASE)',
    lowercase: '소문자 (lowercase)',
    titleCase: '제목형 (Title Case)',
    sentenceCase: '문장형 (Sentence case)',
    toggleCase: '토글형 (tOGGLE cASE)',
    camelCase: '카멜형 (camelCase)',
    pascalCase: '파스칼형 (PascalCase)',
    snakeCase: '스네이크형 (snake_case)',
    kebabCase: '케밥형 (kebab-case)',
    copy: '복사',
    copied: '복사됨!',
    clear: '지우기',
    result: '변환 결과',
  },
  en: {
    title: 'Text Case Converter',
    description: 'Convert English text to uppercase, lowercase, title case, and more formats instantly',
    inputLabel: 'Enter text to convert',
    placeholder: 'Enter your text here...',
    uppercase: 'UPPERCASE',
    lowercase: 'lowercase',
    titleCase: 'Title Case',
    sentenceCase: 'Sentence case',
    toggleCase: 'tOGGLE cASE',
    camelCase: 'camelCase',
    pascalCase: 'PascalCase',
    snakeCase: 'snake_case',
    kebabCase: 'kebab-case',
    copy: 'Copy',
    copied: 'Copied!',
    clear: 'Clear',
    result: 'Result',
  }
};

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'toggle' | 'camel' | 'pascal' | 'snake' | 'kebab';

export default function CaseConverter() {
  const { t } = useLocalizedContent(i18n);
  const [text, setText] = useState('');
  const [copiedCase, setCopiedCase] = useState<CaseType | null>(null);

  const toTitleCase = (str: string) =>
    str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const toSentenceCase = (str: string) =>
    str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());

  const toToggleCase = (str: string) =>
    str.split('').map((char) =>
      char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
    ).join('');

  const toCamelCase = (str: string) =>
    str.toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());

  const toPascalCase = (str: string) => {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  const toSnakeCase = (str: string) =>
    str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');

  const toKebabCase = (str: string) =>
    str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');

  const conversions: { type: CaseType; label: string; value: string }[] = [
    { type: 'upper', label: t.uppercase, value: text.toUpperCase() },
    { type: 'lower', label: t.lowercase, value: text.toLowerCase() },
    { type: 'title', label: t.titleCase, value: toTitleCase(text) },
    { type: 'sentence', label: t.sentenceCase, value: toSentenceCase(text) },
    { type: 'toggle', label: t.toggleCase, value: toToggleCase(text) },
    { type: 'camel', label: t.camelCase, value: toCamelCase(text) },
    { type: 'pascal', label: t.pascalCase, value: toPascalCase(text) },
    { type: 'snake', label: t.snakeCase, value: toSnakeCase(text) },
    { type: 'kebab', label: t.kebabCase, value: toKebabCase(text) },
  ];

  const copyToClipboard = async (value: string, type: CaseType) => {
    await navigator.clipboard.writeText(value);
    setCopiedCase(type);
    setTimeout(() => setCopiedCase(null), 2000);
  };

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.inputLabel}
            </label>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.placeholder}
                className="w-full p-4 border rounded-lg resize-none h-32 text-lg"
              />
              {text && (
                <button
                  onClick={() => setText('')}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {text && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">{t.result}</h2>
              {conversions.map(({ type, label, value }) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="font-mono text-sm truncate">{value}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(value, type)}
                    className={`ml-3 px-3 py-1 text-sm rounded ${
                      copiedCase === type
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {copiedCase === type ? t.copied : t.copy}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
