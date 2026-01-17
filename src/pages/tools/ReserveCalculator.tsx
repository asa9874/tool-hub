import { useState, useMemo } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '예비군/민방위 연차 계산기',
    description: '전역 연도를 입력하면 현재 예비군 연차와 교육 유형을 알려드립니다',
    dischargeYear: '전역 연도',
    calculate: '계산하기',
    currentYear: '현재 연도',
    yearsAfterDischarge: '전역 후 경과',
    years: '년',
    status: '상태',
    trainingType: '교육 유형',
    reserveYears: '예비군 연차',
    remainingYears: '남은 예비군 기간',
    civilDefenseYear: '민방위 연차',
    civilDefenseRemaining: '남은 민방위 기간',
    
    statuses: {
      reserve1to4: '예비군 (동원)',
      reserve5to6: '예비군 (동미참)',
      reserve7to8: '예비군 (기본)',
      civilDefense: '민방위',
      completed: '의무 종료',
    },
    
    trainingTypes: {
      mobilization: '동원훈련 (2박3일)',
      mobilizationAlternative: '동미참훈련 (2일)',
      basic: '기본훈련 (1일)',
      civilDefense: '민방위훈련 (4시간)',
      none: '교육 없음',
    },
    
    schedule: {
      title: '예비군/민방위 훈련 일정표',
      year: '연차',
      type: '구분',
      training: '훈련 유형',
      duration: '기간',
    },
    
    info: {
      title: '안내 사항',
      items: [
        '예비군 훈련은 전역 후 8년간 실시됩니다.',
        '1~4년차: 동원훈련 (2박3일) 또는 동미참훈련 (2일)',
        '5~6년차: 동미참훈련 (2일)',
        '7~8년차: 기본훈련 (1일)',
        '민방위는 예비군 종료 후 만 40세까지 편입됩니다.',
        '※ 정확한 훈련 일정은 병무청에서 확인하세요.',
      ],
    },
    
    disclaimer: '* 이 계산기는 참고용이며, 정확한 정보는 병무청 또는 관할 동사무소에서 확인하세요.',
  },
  en: {
    title: 'Reserve Forces Calculator (Korea)',
    description: 'Enter your discharge year to check your reserve forces status and training type',
    dischargeYear: 'Discharge Year',
    calculate: 'Calculate',
    currentYear: 'Current Year',
    yearsAfterDischarge: 'Years Since Discharge',
    years: 'years',
    status: 'Status',
    trainingType: 'Training Type',
    reserveYears: 'Reserve Year',
    remainingYears: 'Remaining Reserve',
    civilDefenseYear: 'Civil Defense Year',
    civilDefenseRemaining: 'Remaining Civil Defense',
    
    statuses: {
      reserve1to4: 'Reserve (Mobilization)',
      reserve5to6: 'Reserve (Alternative)',
      reserve7to8: 'Reserve (Basic)',
      civilDefense: 'Civil Defense',
      completed: 'Duty Completed',
    },
    
    trainingTypes: {
      mobilization: 'Mobilization Training (3 days)',
      mobilizationAlternative: 'Alternative Training (2 days)',
      basic: 'Basic Training (1 day)',
      civilDefense: 'Civil Defense Training (4 hours)',
      none: 'No Training',
    },
    
    schedule: {
      title: 'Training Schedule',
      year: 'Year',
      type: 'Type',
      training: 'Training',
      duration: 'Duration',
    },
    
    info: {
      title: 'Information',
      items: [
        'Reserve training lasts for 8 years after discharge.',
        'Years 1-4: Mobilization training (3 days) or Alternative (2 days)',
        'Years 5-6: Alternative training (2 days)',
        'Years 7-8: Basic training (1 day)',
        'Civil Defense is mandatory until age 40 after reserve duty.',
        '※ Check the Military Manpower Administration for exact schedules.',
      ],
    },
    
    disclaimer: '* This calculator is for reference only. Please verify with the Military Manpower Administration.',
  }
};

export default function ReserveCalculator() {
  const { t } = useLocalizedContent(i18n);
  const currentYear = new Date().getFullYear();
  const [dischargeYear, setDischargeYear] = useState(currentYear - 1);

  const result = useMemo(() => {
    const yearsAfterDischarge = currentYear - dischargeYear;
    
    if (yearsAfterDischarge < 1) {
      return {
        yearsAfterDischarge: 0,
        status: 'active',
        trainingType: 'none',
        reserveYear: 0,
        remainingReserve: 8,
        civilDefenseYear: 0,
        civilDefenseRemaining: 0,
      };
    }

    let status: string;
    let trainingType: string;
    let civilDefenseYear = 0;
    let civilDefenseRemaining = 0;

    if (yearsAfterDischarge <= 4) {
      status = 'reserve1to4';
      trainingType = 'mobilization';
    } else if (yearsAfterDischarge <= 6) {
      status = 'reserve5to6';
      trainingType = 'mobilizationAlternative';
    } else if (yearsAfterDischarge <= 8) {
      status = 'reserve7to8';
      trainingType = 'basic';
    } else {
      // 만 40세까지 민방위 (대략 전역 후 약 20년으로 가정)
      const maxCivilDefenseYears = 12; // 대략적인 기간
      civilDefenseYear = yearsAfterDischarge - 8;
      
      if (civilDefenseYear <= maxCivilDefenseYears) {
        status = 'civilDefense';
        trainingType = 'civilDefense';
        civilDefenseRemaining = maxCivilDefenseYears - civilDefenseYear;
      } else {
        status = 'completed';
        trainingType = 'none';
      }
    }

    const reserveYear = Math.min(yearsAfterDischarge, 8);
    const remainingReserve = Math.max(0, 8 - yearsAfterDischarge);

    return {
      yearsAfterDischarge,
      status,
      trainingType,
      reserveYear,
      remainingReserve,
      civilDefenseYear,
      civilDefenseRemaining,
    };
  }, [dischargeYear, currentYear]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserve1to4': return 'from-red-500 to-red-600';
      case 'reserve5to6': return 'from-orange-500 to-orange-600';
      case 'reserve7to8': return 'from-yellow-500 to-yellow-600';
      case 'civilDefense': return 'from-blue-500 to-blue-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const scheduleData = [
    { year: '1~4', type: t.statuses.reserve1to4, training: t.trainingTypes.mobilization, duration: '2박3일' },
    { year: '5~6', type: t.statuses.reserve5to6, training: t.trainingTypes.mobilizationAlternative, duration: '2일' },
    { year: '7~8', type: t.statuses.reserve7to8, training: t.trainingTypes.basic, duration: '1일' },
    { year: '9~', type: t.statuses.civilDefense, training: t.trainingTypes.civilDefense, duration: '4시간' },
  ];

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['예비군 계산기', '민방위 연차', '예비군 훈련', '동원훈련', '기본훈련', 'reserve forces']}
        canonical="/tools/reserve-calculator"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          {/* 입력 */}
          <div className="flex flex-wrap gap-4 items-end mb-8">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.dischargeYear}
              </label>
              <input
                type="number"
                min={1990}
                max={currentYear}
                value={dischargeYear}
                onChange={(e) => setDischargeYear(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            <div className="text-gray-500">
              {t.currentYear}: <span className="font-bold">{currentYear}</span>
            </div>
          </div>

          {/* 결과 카드 */}
          <div className={`bg-gradient-to-r ${getStatusColor(result.status)} rounded-xl p-6 text-white mb-6`}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm opacity-80">{t.status}</p>
                <p className="text-3xl font-bold mb-2">
                  {t.statuses[result.status as keyof typeof t.statuses]}
                </p>
                <p className="text-sm opacity-80">{t.trainingType}</p>
                <p className="text-xl font-semibold">
                  {t.trainingTypes[result.trainingType as keyof typeof t.trainingTypes]}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-80">{t.yearsAfterDischarge}:</span>
                  <span className="font-bold">{result.yearsAfterDischarge} {t.years}</span>
                </div>
                {result.reserveYear > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="opacity-80">{t.reserveYears}:</span>
                      <span className="font-bold">{result.reserveYear} {t.years}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">{t.remainingYears}:</span>
                      <span className="font-bold">{result.remainingReserve} {t.years}</span>
                    </div>
                  </>
                )}
                {result.civilDefenseYear > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="opacity-80">{t.civilDefenseYear}:</span>
                      <span className="font-bold">{result.civilDefenseYear} {t.years}</span>
                    </div>
                    {result.civilDefenseRemaining > 0 && (
                      <div className="flex justify-between">
                        <span className="opacity-80">{t.civilDefenseRemaining}:</span>
                        <span className="font-bold">~{result.civilDefenseRemaining} {t.years}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 진행바 */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>예비군 진행도</span>
              <span>{Math.min(result.yearsAfterDischarge, 8)} / 8 {t.years}</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                style={{ width: `${Math.min(result.yearsAfterDischarge / 8 * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* 훈련 일정표 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{t.schedule.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-3 text-left">{t.schedule.year}</th>
                    <th className="py-2 px-3 text-left">{t.schedule.type}</th>
                    <th className="py-2 px-3 text-left">{t.schedule.training}</th>
                    <th className="py-2 px-3 text-left">{t.schedule.duration}</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-medium">{row.year}</td>
                      <td className="py-2 px-3">{row.type}</td>
                      <td className="py-2 px-3">{row.training}</td>
                      <td className="py-2 px-3">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 안내 사항 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">{t.info.title}</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              {t.info.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">{t.disclaimer}</p>
        </div>
      </div>
    </>
  );
}
