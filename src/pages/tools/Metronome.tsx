import { useState, useRef, useCallback, useEffect } from 'react';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';

const i18n = {
  ko: {
    title: '심플 메트로놈',
    subtitle: 'BPM을 설정하고 일정한 박자 소리를 들으세요',
    description: '웹 기반 메트로놈으로 악기 연습 시 정확한 박자를 유지하세요.',
    bpm: 'BPM',
    beatsPerMeasure: '박자',
    start: '▶ 시작',
    stop: '■ 정지',
    tap: 'TAP',
    tapTempo: 'TAP으로 BPM 측정',
    volume: '볼륨',
    accent: '강세음',
    sound: '소리',
    sounds: {
      click: '클릭',
      wood: '우드블록',
      beep: '비프',
      drum: '드럼',
    },
    presets: '프리셋',
    presetList: [
      { name: 'Largo', bpm: 50, desc: '매우 느리게' },
      { name: 'Adagio', bpm: 70, desc: '느리게' },
      { name: 'Andante', bpm: 90, desc: '걷는 빠르기' },
      { name: 'Moderato', bpm: 110, desc: '보통 빠르기' },
      { name: 'Allegro', bpm: 130, desc: '빠르게' },
      { name: 'Vivace', bpm: 160, desc: '활발하게' },
      { name: 'Presto', bpm: 180, desc: '매우 빠르게' },
    ],
    faq: {
      q1: '메트로놈은 무엇에 사용하나요?',
      a1: '메트로놈은 일정한 박자를 제공하여 악기 연습, 리듬 훈련, 템포 유지에 도움을 줍니다. 기타, 피아노, 드럼 등 모든 악기 연습에 필수적인 도구입니다.',
      q2: 'BPM이란 무엇인가요?',
      a2: 'BPM은 Beats Per Minute의 약자로, 1분당 박자 수를 의미합니다. BPM 60은 1초에 1박, BPM 120은 1초에 2박입니다. 곡의 빠르기를 나타내는 표준 단위입니다.',
      q3: 'TAP 기능은 어떻게 사용하나요?',
      a3: 'TAP 버튼을 원하는 박자에 맞춰 여러 번 누르면 자동으로 BPM을 계산합니다. 듣고 있는 음악의 템포를 측정하거나, 원하는 박자를 찾을 때 유용합니다.',
    },
  },
};

type SoundType = 'click' | 'wood' | 'beep' | 'drum';

export default function Metronome() {
  const lang = 'ko';
  const t = i18n[lang];

  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [volume, setVolume] = useState(0.7);
  const [accentFirst, setAccentFirst] = useState(true);
  const [soundType, setSoundType] = useState<SoundType>('click');
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'metronome');

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

  // 소리 생성
  const playClick = useCallback((isAccent: boolean) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const baseFreq = soundType === 'click' ? 1000 : soundType === 'wood' ? 800 : soundType === 'beep' ? 880 : 200;
    const accentFreq = soundType === 'click' ? 1500 : soundType === 'wood' ? 1200 : soundType === 'beep' ? 1320 : 300;

    osc.frequency.value = isAccent && accentFirst ? accentFreq : baseFreq;
    osc.type = soundType === 'drum' ? 'triangle' : 'sine';

    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(volume * (isAccent && accentFirst ? 1 : 0.7), now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }, [soundType, volume, accentFirst]);

  // 스케줄러
  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const secondsPerBeat = 60.0 / bpm;

    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      const isAccent = currentBeatRef.current === 0;
      playClick(isAccent);

      setCurrentBeat(currentBeatRef.current);
      currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
      nextNoteTimeRef.current += secondsPerBeat;
    }
  }, [bpm, beatsPerMeasure, playClick]);

  // 시작/정지
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
      setCurrentBeat(0);
      currentBeatRef.current = 0;
    } else {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      nextNoteTimeRef.current = audioContextRef.current.currentTime;
      currentBeatRef.current = 0;
      intervalRef.current = window.setInterval(scheduler, 25);
      setIsPlaying(true);
    }
  }, [isPlaying, scheduler]);

  // TAP 템포 측정
  const handleTap = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].filter((t) => now - t < 3000).slice(-8);
    setTapTimes(newTapTimes);

    if (newTapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 20 && calculatedBpm <= 300) {
        setBpm(calculatedBpm);
      }
    }
  };

  // BPM 변경 시 재시작
  useEffect(() => {
    if (isPlaying && audioContextRef.current) {
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current = audioContextRef.current.currentTime + secondsPerBeat;
    }
  }, [bpm, isPlaying]);

  // 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <>
      <SEO
        title={toolInfo?.title || t.title}
        description={toolInfo?.description || t.description}
        keywords={toolInfo?.keywords}
        canonical={toolInfo?.path}
        structuredData={structuredData}
      />

      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">🎵 {t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </header>

        {/* 메트로놈 메인 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* BPM 디스플레이 */}
          <div className="text-center mb-8">
            <div className="text-7xl md:text-9xl font-bold text-indigo-600 mb-2">{bpm}</div>
            <div className="text-xl text-gray-500">{t.bpm}</div>
          </div>

          {/* 박자 시각화 */}
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: beatsPerMeasure }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 md:w-12 md:h-12 rounded-full transition-all duration-100 ${
                  isPlaying && currentBeat === i
                    ? i === 0
                      ? 'bg-red-500 scale-125'
                      : 'bg-indigo-500 scale-110'
                    : i === 0
                    ? 'bg-red-200'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* BPM 슬라이더 */}
          <div className="mb-8">
            <input
              type="range"
              min="20"
              max="240"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>20</span>
              <span>120</span>
              <span>240</span>
            </div>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={togglePlay}
              className={`px-12 py-4 rounded-xl font-bold text-xl transition-colors ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isPlaying ? t.stop : t.start}
            </button>
            <button
              onClick={handleTap}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xl transition-colors"
            >
              {t.tap}
            </button>
          </div>

          {/* 설정 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 박자 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.beatsPerMeasure}</label>
              <select
                value={beatsPerMeasure}
                onChange={(e) => setBeatsPerMeasure(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}/4
                  </option>
                ))}
              </select>
            </div>

            {/* 소리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.sound}</label>
              <select
                value={soundType}
                onChange={(e) => setSoundType(e.target.value as SoundType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {(Object.keys(t.sounds) as SoundType[]).map((key) => (
                  <option key={key} value={key}>
                    {t.sounds[key]}
                  </option>
                ))}
              </select>
            </div>

            {/* 볼륨 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.volume}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* 강세음 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.accent}</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accentFirst}
                  onChange={(e) => setAccentFirst(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">첫 박 강조</span>
              </label>
            </div>
          </div>
        </section>

        {/* 프리셋 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎼 {t.presets}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {t.presetList.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setBpm(preset.bpm)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  bpm === preset.bpm
                    ? 'bg-indigo-100 border-2 border-indigo-500'
                    : 'bg-gray-50 border border-gray-200 hover:bg-indigo-50'
                }`}
              >
                <div className="font-medium text-gray-800">{preset.name}</div>
                <div className="text-lg font-bold text-indigo-600">{preset.bpm}</div>
                <div className="text-xs text-gray-500">{preset.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* 광고 */}
        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 온라인 메트로놈 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>웹 메트로놈</strong>은 별도의 앱 설치 없이 브라우저에서 바로 사용할 수 있는 무료 메트로놈입니다.
              기타, 피아노, 드럼 등 모든 악기 연습에 활용하세요.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              슬라이더로 BPM을 조절하거나, 프리셋에서 원하는 템포를 선택하세요. TAP 버튼을 리듬에 맞춰 누르면 자동으로 BPM을 측정할 수
              있습니다. 4/4, 3/4 등 다양한 박자도 지원합니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              강세음 옵션을 켜면 첫 박에 더 높은 소리가 나서 마디의 시작을 쉽게 구분할 수 있습니다.
              볼륨과 소리 종류도 취향에 맞게 조절해보세요. 정확한 박자 연습의 시작, 심플 메트로놈과 함께하세요!
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
