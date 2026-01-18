import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

// 음계 정의
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES: Record<string, string> = {
  'C': '도', 'C#': '도#', 'D': '레', 'D#': '레#', 'E': '미', 'F': '파',
  'F#': '파#', 'G': '솔', 'G#': '솔#', 'A': '라', 'A#': '라#', 'B': '시',
};

const i18n = {
  ko: {
    title: '코드 조바꿈 도구',
    subtitle: '곡의 키(Key)를 변경하고 새로운 코드 진행을 확인하세요',
    description: '기타, 피아노 연주자를 위한 코드 조옮김 도구. 원하는 키로 쉽게 변환합니다.',
    originalKey: '원래 키',
    targetKey: '바꿀 키',
    transpose: '조바꿈',
    semitonesUp: '반음 올림',
    semitonesDown: '반음 내림',
    semitones: '반음',
    inputChords: '코드 진행 입력',
    inputPlaceholder: 'C Am F G\n또는\nC - Am - F - G',
    result: '변환된 코드 진행',
    commonProgressions: '자주 쓰는 코드 진행',
    progressions: [
      { name: '캐논 진행', chords: 'C G Am Em F C F G', desc: '가장 유명한 진행' },
      { name: '4536 진행', chords: 'F G Em Am', desc: 'J-POP, K-POP 필수' },
      { name: '1564 진행', chords: 'C G Am F', desc: '팝송 기본 진행' },
      { name: '1645 진행', chords: 'C Am F G', desc: '발라드 기본 진행' },
      { name: '블루스 진행', chords: 'C C C C F F C C G F C G', desc: '12마디 블루스' },
      { name: '재즈 2-5-1', chords: 'Dm7 G7 Cmaj7', desc: '재즈 기본 진행' },
    ],
    tips: '💡 조바꿈 팁',
    tipsList: [
      '카포를 사용하면 오픈 코드 폼을 유지하면서 키를 올릴 수 있습니다.',
      '남성 키에서 여성 키로 바꿀 때는 보통 +3~5 반음 올립니다.',
      '기타 치기 어려운 키(예: F, Bb)는 카포로 쉬운 키로 바꿔보세요.',
    ],
    capoSuggestion: '카포 제안',
    capoPosition: '카포 {fret}프렛으로 {chord} 코드 폼 사용',
    faq: {
      q1: '조바꿈이란 무엇인가요?',
      a1: '조바꿈(Transposition)은 곡의 모든 음을 동일한 간격만큼 올리거나 내리는 것입니다. 예를 들어 C 키의 곡을 G 키로 바꾸면 모든 코드가 5반음 위로 이동합니다.',
      q2: '왜 조바꿈이 필요한가요?',
      a2: '가수의 음역대에 맞추거나, 연주하기 쉬운 코드로 바꾸거나, 다른 악기와 맞추기 위해 조바꿈을 합니다. 특히 기타에서는 카포와 함께 사용하면 더 쉽게 연주할 수 있습니다.',
      q3: '샵(#)과 플랫(b)은 어떻게 다른가요?',
      a3: 'C#과 Db는 같은 음이지만 표기가 다릅니다. 일반적으로 샵 계열 키(G, D, A, E, B)에서는 샵을, 플랫 계열 키(F, Bb, Eb, Ab)에서는 플랫을 사용합니다. 이 도구는 샵 표기를 기본으로 사용합니다.',
    },
  },
};

export default function ChordTransposer() {
  const lang = 'ko';
  const t = i18n[lang];

  const [originalKey, setOriginalKey] = useState('C');
  const [targetKey, setTargetKey] = useState('G');
  const [inputChords, setInputChords] = useState('C Am F G');
  const [transposeSemitones, setTransposeSemitones] = useState(0);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'chord-transposer');

  // 반음 수 계산
  const semitones = useMemo(() => {
    const fromIndex = NOTES.indexOf(originalKey.replace('m', '').replace(/[0-9]/g, ''));
    const toIndex = NOTES.indexOf(targetKey.replace('m', '').replace(/[0-9]/g, ''));
    if (fromIndex === -1 || toIndex === -1) return transposeSemitones;
    return (toIndex - fromIndex + 12) % 12;
  }, [originalKey, targetKey, transposeSemitones]);

  // 코드 변환 함수
  const transposeChord = (chord: string, semitones: number): string => {
    // 코드 파싱 (예: C#m7 -> root: C#, type: m7)
    const match = chord.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return chord;

    const [, root, type] = match;
    let noteIndex = NOTES.indexOf(root);

    // 플랫 처리
    if (root.includes('b')) {
      const baseNote = root[0];
      noteIndex = (NOTES.indexOf(baseNote) - 1 + 12) % 12;
    }

    if (noteIndex === -1) return chord;

    const newIndex = (noteIndex + semitones + 12) % 12;
    return NOTES[newIndex] + type;
  };

  // 전체 코드 진행 변환
  const transposedChords = useMemo(() => {
    const chords = inputChords
      .replace(/[-|,]/g, ' ')
      .split(/\s+/)
      .filter((c) => c.trim());

    return chords.map((chord) => transposeChord(chord, semitones)).join(' ');
  }, [inputChords, semitones]);

  // 구조화된 데이터
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description || t.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'MusicApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: t.faq.q1, acceptedAnswer: { '@type': 'Answer', text: t.faq.a1 } },
      { '@type': 'Question', name: t.faq.q2, acceptedAnswer: { '@type': 'Answer', text: t.faq.a2 } },
      { '@type': 'Question', name: t.faq.q3, acceptedAnswer: { '@type': 'Answer', text: t.faq.a3 } },
    ],
  };

  // 프리셋 적용
  const applyProgression = (chords: string) => {
    setInputChords(chords);
    setOriginalKey('C');
  };

  // 반음 조절
  const adjustSemitones = (delta: number) => {
    const newSemitones = (semitones + delta + 12) % 12;
    setTransposeSemitones(newSemitones);
    const newKeyIndex = (NOTES.indexOf(originalKey) + newSemitones) % 12;
    setTargetKey(NOTES[newKeyIndex]);
  };

  // 카포 제안 계산
  const capoSuggestions = useMemo(() => {
    const suggestions = [];
    const easyKeys = ['C', 'G', 'D', 'A', 'E'];

    for (const easyKey of easyKeys) {
      const easyKeyIndex = NOTES.indexOf(easyKey);
      const targetIndex = NOTES.indexOf(targetKey);
      const capoFret = (targetIndex - easyKeyIndex + 12) % 12;

      if (capoFret > 0 && capoFret <= 7) {
        suggestions.push({ fret: capoFret, key: easyKey });
      }
    }

    return suggestions.slice(0, 3);
  }, [targetKey]);

  return (
    <>
      <SEO
        title={toolInfo?.title || t.title}
        description={toolInfo?.description || t.description}
        keywords={toolInfo?.keywords}
        canonical={toolInfo?.path}
        structuredData={structuredData}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🎸 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 메인 도구 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* 키 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.originalKey}</label>
              <select
                value={originalKey}
                onChange={(e) => setOriginalKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-lg"
              >
                {NOTES.map((note) => (
                  <option key={note} value={note}>
                    {note} ({NOTE_NAMES[note]})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end justify-center gap-2">
              <button
                onClick={() => adjustSemitones(-1)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                -1
              </button>
              <div className="text-center px-4">
                <div className="text-3xl font-bold text-amber-600">+{semitones}</div>
                <div className="text-sm text-gray-500">{t.semitones}</div>
              </div>
              <button
                onClick={() => adjustSemitones(1)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                +1
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.targetKey}</label>
              <select
                value={targetKey}
                onChange={(e) => setTargetKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-lg"
              >
                {NOTES.map((note) => (
                  <option key={note} value={note}>
                    {note} ({NOTE_NAMES[note]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 코드 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.inputChords}</label>
            <textarea
              value={inputChords}
              onChange={(e) => setInputChords(e.target.value)}
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-lg"
              placeholder={t.inputPlaceholder}
            />
          </div>

          {/* 결과 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.result}</label>
            <div className="w-full min-h-24 px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-lg font-mono text-lg">
              <div className="flex flex-wrap gap-2">
                {transposedChords.split(' ').map((chord, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-100 rounded-lg font-bold text-amber-800"
                  >
                    {chord}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 카포 제안 */}
          {capoSuggestions.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">🎯 {t.capoSuggestion}</h3>
              <div className="flex flex-wrap gap-2">
                {capoSuggestions.map((s) => (
                  <span key={s.key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    카포 {s.fret}프렛 → {s.key} 폼 사용
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 자주 쓰는 코드 진행 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎵 {t.commonProgressions}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.progressions.map((prog) => (
              <button
                key={prog.name}
                onClick={() => applyProgression(prog.chords)}
                className="p-4 bg-gray-50 hover:bg-amber-50 rounded-lg text-left transition-colors border border-gray-200 hover:border-amber-300"
              >
                <div className="font-medium text-gray-800">{prog.name}</div>
                <div className="text-sm font-mono text-amber-600 my-1">{prog.chords}</div>
                <div className="text-xs text-gray-500">{prog.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* 광고 */}
        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* 팁 섹션 */}
        <section className="bg-amber-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.tips}</h2>
          <ul className="space-y-3">
            {t.tipsList.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-amber-500">🎸</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ 섹션 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ 자주 묻는 질문</h2>
          <div className="space-y-6">
            <article className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {t.faq.q1}</h3>
              <p className="text-gray-600 leading-relaxed">A. {t.faq.a1}</p>
            </article>
            <article className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {t.faq.q2}</h3>
              <p className="text-gray-600 leading-relaxed">A. {t.faq.a2}</p>
            </article>
            <article>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {t.faq.q3}</h3>
              <p className="text-gray-600 leading-relaxed">A. {t.faq.a3}</p>
            </article>
          </div>
        </section>

        {/* 사용법 설명 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 조바꿈 도구 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>코드 조바꿈 도구</strong>는 기타나 피아노로 곡을 연주할 때 원하는 키로 코드를 변환해주는 도구입니다.
              노래방에서 키를 올리거나 내리는 것처럼, 곡 전체의 코드를 한 번에 바꿀 수 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              사용법은 간단합니다. 원래 키와 바꿀 키를 선택하고, 코드 진행을 입력하면 자동으로 변환됩니다.
              또는 +/- 버튼으로 반음 단위로 조절할 수도 있습니다. 자주 쓰는 코드 진행 프리셋도 제공됩니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              기타 연주자를 위한 카포 제안 기능도 있습니다. 어려운 코드가 많은 키(F, Bb 등)를 쉬운 오픈 코드로 연주할 수 있도록
              카포 위치와 사용할 코드 폼을 추천해드립니다. 기타, 우쿨렐레, 피아노 독학러들의 필수 도구로 활용하세요!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
