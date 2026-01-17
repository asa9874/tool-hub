import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '수면 사이클 계산기',
    description: '최적의 수면 시간과 기상 시간을 계산하여 상쾌한 아침을 맞이하세요',
    mode: {
      wakeUp: '일어나야 할 시간을 알고 있어요',
      sleepNow: '지금 자려고 해요',
    },
    wakeUpTime: '기상 시간',
    sleepTime: '취침 시간',
    calculate: '계산하기',
    fallAsleepTime: '잠들기까지 걸리는 시간',
    minutes: '분',
    results: '추천 취침 시간',
    wakeResults: '추천 기상 시간',
    cycles: '사이클',
    sleepDuration: '수면 시간',
    hours: '시간',
    quality: {
      excellent: '🌟 최적 (5-6 사이클)',
      good: '😊 양호 (4 사이클)',
      fair: '😐 보통 (3 사이클)',
      poor: '😴 부족 (2 사이클 이하)',
    },
    info: {
      title: '수면 사이클 이해하기',
      items: [
        '수면 사이클은 약 90분 단위로 구성됩니다.',
        '한 사이클은 경수면 → 깊은수면 → REM수면 순으로 진행됩니다.',
        '사이클 중간에 깨면 피로감을 느끼고, 사이클이 끝날 때 깨면 상쾌합니다.',
        '성인의 적정 수면은 5-6 사이클 (7.5~9시간)입니다.',
        '잠드는 데 평균 14분이 걸립니다.',
      ],
    },
    tips: {
      title: '💡 숙면을 위한 팁',
      items: [
        '취침 2시간 전에는 카페인을 피하세요.',
        '침실 온도는 18-20°C가 적당합니다.',
        '취침 전 블루라이트(스마트폰, PC) 노출을 줄이세요.',
        '규칙적인 수면 스케줄을 유지하세요.',
        '낮잠은 20분 이내로 제한하세요.',
      ],
    },
    now: '현재 시간',
  },
  en: {
    title: 'Sleep Cycle Calculator',
    description: 'Calculate optimal sleep and wake times for refreshing mornings',
    mode: {
      wakeUp: 'I know when I need to wake up',
      sleepNow: 'I want to sleep now',
    },
    wakeUpTime: 'Wake Up Time',
    sleepTime: 'Bedtime',
    calculate: 'Calculate',
    fallAsleepTime: 'Time to fall asleep',
    minutes: 'min',
    results: 'Recommended Bedtimes',
    wakeResults: 'Recommended Wake Times',
    cycles: 'cycles',
    sleepDuration: 'Sleep Duration',
    hours: 'hours',
    quality: {
      excellent: '🌟 Optimal (5-6 cycles)',
      good: '😊 Good (4 cycles)',
      fair: '😐 Fair (3 cycles)',
      poor: '😴 Poor (2 cycles or less)',
    },
    info: {
      title: 'Understanding Sleep Cycles',
      items: [
        'Each sleep cycle is approximately 90 minutes.',
        'A cycle progresses: Light Sleep → Deep Sleep → REM Sleep.',
        'Waking mid-cycle causes grogginess; waking at cycle end feels refreshing.',
        'Adults need 5-6 cycles (7.5-9 hours) of sleep.',
        'It takes an average of 14 minutes to fall asleep.',
      ],
    },
    tips: {
      title: '💡 Tips for Better Sleep',
      items: [
        'Avoid caffeine 2 hours before bed.',
        'Keep bedroom temperature at 64-68°F (18-20°C).',
        'Reduce blue light exposure before sleep.',
        'Maintain a consistent sleep schedule.',
        'Limit naps to 20 minutes or less.',
      ],
    },
    now: 'Current Time',
  }
};

const CYCLE_DURATION = 90; // 분 단위
const CYCLES = [6, 5, 4, 3]; // 추천 사이클 수

export default function SleepCalculator() {
  const { t } = useLocalizedContent(i18n);
  const [mode, setMode] = useState<'wakeUp' | 'sleepNow'>('wakeUp');
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [fallAsleepMinutes, setFallAsleepMinutes] = useState(14);

  const results = useMemo(() => {
    if (mode === 'wakeUp') {
      // 기상 시간 기준으로 취침 시간 계산
      const [hours, minutes] = wakeUpTime.split(':').map(Number);
      const wakeUpDate = new Date();
      wakeUpDate.setHours(hours, minutes, 0, 0);

      return CYCLES.map(cycle => {
        const sleepDuration = cycle * CYCLE_DURATION;
        const bedTime = new Date(wakeUpDate.getTime() - (sleepDuration + fallAsleepMinutes) * 60 * 1000);
        
        // 자정을 넘기는 경우 처리
        if (bedTime > wakeUpDate) {
          bedTime.setDate(bedTime.getDate() - 1);
        }

        return {
          cycle,
          time: bedTime,
          timeString: bedTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
          duration: sleepDuration / 60,
          quality: cycle >= 5 ? 'excellent' : cycle >= 4 ? 'good' : cycle >= 3 ? 'fair' : 'poor',
        };
      });
    } else {
      // 지금 자면 언제 일어나야 하는지 계산
      const now = new Date();
      const sleepTime = new Date(now.getTime() + fallAsleepMinutes * 60 * 1000);

      return CYCLES.map(cycle => {
        const sleepDuration = cycle * CYCLE_DURATION;
        const wakeTime = new Date(sleepTime.getTime() + sleepDuration * 60 * 1000);

        return {
          cycle,
          time: wakeTime,
          timeString: wakeTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
          duration: sleepDuration / 60,
          quality: cycle >= 5 ? 'excellent' : cycle >= 4 ? 'good' : cycle >= 3 ? 'fair' : 'poor',
        };
      });
    }
  }, [mode, wakeUpTime, fallAsleepMinutes]);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'from-green-400 to-green-600';
      case 'good': return 'from-blue-400 to-blue-600';
      case 'fair': return 'from-yellow-400 to-yellow-600';
      default: return 'from-red-400 to-red-600';
    }
  };

  const now = new Date();
  const currentTimeString = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['수면 계산기', '수면 사이클', '기상 시간', '취침 시간', 'sleep calculator', 'REM 수면']}
        canonical="/tools/sleep-calculator"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🌙</span>
            <h1 className="text-2xl font-bold">{t.title}</h1>
          </div>
          <p className="text-indigo-200 mb-6">{t.description}</p>

          {/* 모드 선택 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setMode('wakeUp')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'wakeUp'
                  ? 'bg-white text-indigo-900'
                  : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              ⏰ {t.mode.wakeUp}
            </button>
            <button
              onClick={() => setMode('sleepNow')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'sleepNow'
                  ? 'bg-white text-indigo-900'
                  : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              😴 {t.mode.sleepNow}
            </button>
          </div>

          {/* 입력 */}
          <div className="bg-indigo-800/30 rounded-lg p-4 mb-6">
            {mode === 'wakeUp' ? (
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="block text-sm text-indigo-200 mb-1">{t.wakeUpTime}</label>
                  <input
                    type="time"
                    value={wakeUpTime}
                    onChange={(e) => setWakeUpTime(e.target.value)}
                    className="px-4 py-3 bg-indigo-950 border border-indigo-700 rounded-lg text-white text-xl focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-indigo-200 mb-1">{t.fallAsleepTime}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={fallAsleepMinutes}
                      onChange={(e) => setFallAsleepMinutes(Number(e.target.value))}
                      className="w-20 px-3 py-3 bg-indigo-950 border border-indigo-700 rounded-lg text-white text-xl focus:ring-2 focus:ring-indigo-400"
                    />
                    <span className="text-indigo-200">{t.minutes}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="block text-sm text-indigo-200 mb-1">{t.now}</label>
                  <div className="px-4 py-3 bg-indigo-950 border border-indigo-700 rounded-lg text-white text-xl">
                    {currentTimeString}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-indigo-200 mb-1">{t.fallAsleepTime}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={fallAsleepMinutes}
                      onChange={(e) => setFallAsleepMinutes(Number(e.target.value))}
                      className="w-20 px-3 py-3 bg-indigo-950 border border-indigo-700 rounded-lg text-white text-xl focus:ring-2 focus:ring-indigo-400"
                    />
                    <span className="text-indigo-200">{t.minutes}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 결과 */}
          <h2 className="text-lg font-semibold text-indigo-200 mb-4">
            {mode === 'wakeUp' ? t.results : t.wakeResults}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((result) => (
              <div
                key={result.cycle}
                className={`bg-gradient-to-br ${getQualityColor(result.quality)} rounded-xl p-4 text-center`}
              >
                <p className="text-5xl font-bold mb-1">{result.timeString}</p>
                <p className="text-sm opacity-80 mb-2">
                  {result.cycle} {t.cycles} ({result.duration} {t.hours})
                </p>
                <p className="text-sm font-medium">
                  {t.quality[result.quality as keyof typeof t.quality]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 수면 사이클 정보 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">{t.info.title}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {t.info.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* 사이클 시각화 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-3">수면 사이클 구조 (90분)</p>
              <div className="flex h-8 rounded-full overflow-hidden">
                <div className="flex-1 bg-blue-300 flex items-center justify-center text-xs text-blue-800">경수면</div>
                <div className="flex-1 bg-blue-600 flex items-center justify-center text-xs text-white">깊은수면</div>
                <div className="flex-1 bg-purple-500 flex items-center justify-center text-xs text-white">REM</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">{t.tips.title}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {t.tips.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
