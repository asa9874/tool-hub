import { useState } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '진수 변환기',
    description: '2진수, 8진수, 10진수, 16진수를 상호 변환합니다',
    inputLabel: '값 입력',
    inputBase: '입력 진수',
    decimal: '10진수 (Decimal)',
    binary: '2진수 (Binary)',
    octal: '8진수 (Octal)',
    hex: '16진수 (Hexadecimal)',
    result: '변환 결과',
    copy: '복사',
    copied: '복사됨!',
    invalid: '유효하지 않은 값입니다',
    swap: '값 바꾸기',
    clear: '지우기',
    examples: '예시',
    bitOperations: '비트 연산',
    leftShift: '왼쪽 시프트',
    rightShift: '오른쪽 시프트',
    not: 'NOT',
  },
  en: {
    title: 'Number Base Converter',
    description: 'Convert between Binary, Octal, Decimal, and Hexadecimal',
    inputLabel: 'Enter Value',
    inputBase: 'Input Base',
    decimal: 'Decimal (Base 10)',
    binary: 'Binary (Base 2)',
    octal: 'Octal (Base 8)',
    hex: 'Hexadecimal (Base 16)',
    result: 'Conversion Results',
    copy: 'Copy',
    copied: 'Copied!',
    invalid: 'Invalid value',
    swap: 'Swap Values',
    clear: 'Clear',
    examples: 'Examples',
    bitOperations: 'Bit Operations',
    leftShift: 'Left Shift',
    rightShift: 'Right Shift',
    not: 'NOT',
  }
};

type BaseType = 2 | 8 | 10 | 16;

export default function NumberBaseConverter() {
  const { t } = useLocalizedContent(i18n);
  const [input, setInput] = useState('');
  const [inputBase, setInputBase] = useState<BaseType>(10);
  const [copiedBase, setCopiedBase] = useState<BaseType | null>(null);

  const isValidInput = (value: string, base: BaseType): boolean => {
    if (!value) return false;
    const patterns: Record<BaseType, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-fA-F]+$/,
    };
    return patterns[base].test(value);
  };

  const convert = (value: string, fromBase: BaseType, toBase: BaseType): string => {
    if (!isValidInput(value, fromBase)) return '';
    try {
      const decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) return '';
      return decimal.toString(toBase).toUpperCase();
    } catch {
      return '';
    }
  };

  const getDecimalValue = (): number => {
    if (!isValidInput(input, inputBase)) return 0;
    return parseInt(input, inputBase);
  };

  const copyToClipboard = async (value: string, base: BaseType) => {
    await navigator.clipboard.writeText(value);
    setCopiedBase(base);
    setTimeout(() => setCopiedBase(null), 2000);
  };

  const bases: { base: BaseType; label: string; prefix: string }[] = [
    { base: 10, label: t.decimal, prefix: '' },
    { base: 2, label: t.binary, prefix: '0b' },
    { base: 8, label: t.octal, prefix: '0o' },
    { base: 16, label: t.hex, prefix: '0x' },
  ];

  const isValid = isValidInput(input, inputBase);
  const decimalValue = getDecimalValue();

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {/* 입력 */}
          <div className="mb-6">
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.inputLabel}
                </label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.toUpperCase())}
                  placeholder={inputBase === 16 ? 'FF' : inputBase === 2 ? '1010' : '255'}
                  className={`w-full p-3 border rounded-lg font-mono text-lg ${
                    input && !isValid ? 'border-red-500 bg-red-50' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.inputBase}
                </label>
                <select
                  value={inputBase}
                  onChange={(e) => {
                    const newBase = Number(e.target.value) as BaseType;
                    // 현재 값을 새 진수로 변환
                    if (isValid) {
                      const decimal = parseInt(input, inputBase);
                      setInput(decimal.toString(newBase).toUpperCase());
                    } else {
                      setInput('');
                    }
                    setInputBase(newBase);
                  }}
                  className="p-3 border rounded-lg"
                >
                  {bases.map(({ base, label }) => (
                    <option key={base} value={base}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            {input && !isValid && (
              <p className="text-red-500 text-sm">{t.invalid}</p>
            )}
            <button
              onClick={() => setInput('')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {t.clear}
            </button>
          </div>

          {/* 결과 */}
          {isValid && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">{t.result}</h2>
              
              {bases.map(({ base, label, prefix }) => {
                const converted = convert(input, inputBase, base);
                return (
                  <div
                    key={base}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      base === inputBase ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-mono text-lg">
                        <span className="text-gray-400">{prefix}</span>
                        {converted}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(converted, base)}
                      className={`px-3 py-1 rounded ${
                        copiedBase === base
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {copiedBase === base ? t.copied : t.copy}
                    </button>
                  </div>
                );
              })}

              {/* 비트 연산 */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.bitOperations}</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setInput((decimalValue << 1).toString(inputBase).toUpperCase())}
                    className="p-2 bg-white rounded border hover:bg-gray-50 text-sm"
                  >
                    {t.leftShift} (&lt;&lt;1)
                  </button>
                  <button
                    onClick={() => setInput((decimalValue >> 1).toString(inputBase).toUpperCase())}
                    className="p-2 bg-white rounded border hover:bg-gray-50 text-sm"
                  >
                    {t.rightShift} (&gt;&gt;1)
                  </button>
                  <button
                    onClick={() => setInput((~decimalValue >>> 0).toString(inputBase).toUpperCase())}
                    className="p-2 bg-white rounded border hover:bg-gray-50 text-sm"
                  >
                    {t.not} (~)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 예시 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">{t.examples}</h3>
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              <span className="text-gray-500">DEC</span>
              <span className="text-gray-500">BIN</span>
              <span className="text-gray-500">OCT</span>
              <span className="text-gray-500">HEX</span>
              {[10, 15, 255, 1024].map(n => (
                <>
                  <span key={`d${n}`}>{n}</span>
                  <span key={`b${n}`}>{n.toString(2)}</span>
                  <span key={`o${n}`}>{n.toString(8)}</span>
                  <span key={`h${n}`}>{n.toString(16).toUpperCase()}</span>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
