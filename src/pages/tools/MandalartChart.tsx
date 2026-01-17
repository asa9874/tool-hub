import { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '만다라트 계획표',
    description: '오타니 쇼헤이 계획표로 유명한 만다라트 기법으로 목표를 세분화하세요',
    mainGoal: '핵심 목표',
    mainGoalPlaceholder: '이루고 싶은 목표',
    subGoal: '세부 목표',
    subGoalPlaceholder: '세부 목표 입력',
    action: '실천 항목',
    actionPlaceholder: '구체적인 실천',
    save: '저장하기',
    load: '불러오기',
    export: '이미지 저장',
    reset: '초기화',
    saved: '저장되었습니다!',
    step1: '1. 중앙에 핵심 목표를 입력하세요',
    step2: '2. 8개의 세부 목표를 작성하세요',
    step3: '3. 각 세부 목표에 대해 8개의 실천 항목을 작성하세요',
    tip: '💡 Tip: 구체적이고 측정 가능한 목표를 세우세요',
  },
  en: {
    title: 'Mandal-Art Chart',
    description: 'Break down your goals using the Mandal-Art technique, famous for Shohei Ohtani\'s goal chart',
    mainGoal: 'Core Goal',
    mainGoalPlaceholder: 'Your main goal',
    subGoal: 'Sub Goal',
    subGoalPlaceholder: 'Enter sub goal',
    action: 'Action Item',
    actionPlaceholder: 'Specific action',
    save: 'Save',
    load: 'Load',
    export: 'Export Image',
    reset: 'Reset',
    saved: 'Saved!',
    step1: '1. Enter your core goal in the center',
    step2: '2. Write 8 sub-goals',
    step3: '3. Write 8 action items for each sub-goal',
    tip: '💡 Tip: Set specific and measurable goals',
  }
};

interface MandalartData {
  mainGoal: string;
  subGoals: string[];
  actions: string[][];
}

const STORAGE_KEY = 'mandalart-data';

const COLORS = [
  'bg-red-100 border-red-300',
  'bg-orange-100 border-orange-300',
  'bg-yellow-100 border-yellow-300',
  'bg-green-100 border-green-300',
  'bg-teal-100 border-teal-300',
  'bg-blue-100 border-blue-300',
  'bg-indigo-100 border-indigo-300',
  'bg-purple-100 border-purple-300',
];

export default function MandalartChart() {
  const { t } = useLocalizedContent(i18n);
  const [data, setData] = useState<MandalartData>({
    mainGoal: '',
    subGoals: Array(8).fill(''),
    actions: Array(8).fill(null).map(() => Array(8).fill('')),
  });
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('정말 초기화하시겠습니까?')) {
      setData({
        mainGoal: '',
        subGoals: Array(8).fill(''),
        actions: Array(8).fill(null).map(() => Array(8).fill('')),
      });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const updateSubGoal = (index: number, value: string) => {
    setData(prev => ({
      ...prev,
      subGoals: prev.subGoals.map((g, i) => i === index ? value : g),
    }));
  };

  const updateAction = (subIndex: number, actionIndex: number, value: string) => {
    setData(prev => ({
      ...prev,
      actions: prev.actions.map((actions, si) =>
        si === subIndex
          ? actions.map((a, ai) => ai === actionIndex ? value : a)
          : actions
      ),
    }));
  };

  // 3x3 중앙 그리드 렌더링 (핵심 목표 + 8개 세부 목표)
  const renderCenterGrid = () => {
    const positions = [0, 1, 2, 3, -1, 4, 5, 6, 7]; // -1은 중앙 (핵심 목표)
    
    return (
      <div className="grid grid-cols-3 gap-1 p-2 bg-gray-200 rounded-lg">
        {positions.map((pos, idx) => {
          if (pos === -1) {
            return (
              <input
                key="main"
                type="text"
                value={data.mainGoal}
                onChange={(e) => setData(prev => ({ ...prev, mainGoal: e.target.value }))}
                placeholder={t.mainGoalPlaceholder}
                className="w-full h-16 p-2 text-center text-sm font-bold bg-yellow-200 border-2 border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            );
          }
          return (
            <button
              key={idx}
              onClick={() => setActiveSection(activeSection === pos ? null : pos)}
              className={`w-full h-16 p-1 text-xs text-center rounded border-2 transition-all ${COLORS[pos]} ${
                activeSection === pos ? 'ring-2 ring-offset-1 ring-blue-500' : ''
              } ${data.subGoals[pos] ? 'font-medium' : 'text-gray-400'}`}
            >
              {data.subGoals[pos] || `${t.subGoal} ${pos + 1}`}
            </button>
          );
        })}
      </div>
    );
  };

  // 세부 목표에 대한 실천 항목 그리드
  const renderActionGrid = (subIndex: number) => {
    const positions = [0, 1, 2, 3, -1, 4, 5, 6, 7];
    
    return (
      <div className={`grid grid-cols-3 gap-1 p-2 rounded-lg ${COLORS[subIndex].split(' ')[0]}`}>
        {positions.map((pos, idx) => {
          if (pos === -1) {
            return (
              <input
                key="sub"
                type="text"
                value={data.subGoals[subIndex]}
                onChange={(e) => updateSubGoal(subIndex, e.target.value)}
                placeholder={t.subGoalPlaceholder}
                className={`w-full h-12 p-1 text-center text-xs font-bold rounded border-2 ${COLORS[subIndex]} focus:outline-none focus:ring-2`}
              />
            );
          }
          return (
            <input
              key={idx}
              type="text"
              value={data.actions[subIndex][pos]}
              onChange={(e) => updateAction(subIndex, pos, e.target.value)}
              placeholder={t.actionPlaceholder}
              className="w-full h-12 p-1 text-center text-xs bg-white border rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-4">{t.description}</p>

          {/* 사용 방법 */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">{t.step1}</p>
            <p className="text-sm text-blue-800">{t.step2}</p>
            <p className="text-sm text-blue-800">{t.step3}</p>
            <p className="text-sm text-blue-600 mt-2">{t.tip}</p>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {saved ? t.saved : t.save}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {t.reset}
            </button>
          </div>

          {/* 전체 만다라트 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 상단 3개 */}
            {[0, 1, 2].map(i => (
              <div key={i}>{renderActionGrid(i)}</div>
            ))}
            
            {/* 중간: 좌측 + 중앙 + 우측 */}
            <div>{renderActionGrid(3)}</div>
            <div>{renderCenterGrid()}</div>
            <div>{renderActionGrid(4)}</div>
            
            {/* 하단 3개 */}
            {[5, 6, 7].map(i => (
              <div key={i}>{renderActionGrid(i)}</div>
            ))}
          </div>

          {/* 선택된 섹션 상세 편집 */}
          {activeSection !== null && (
            <div className="mt-6 p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
              <h3 className="font-bold text-gray-800 mb-3">
                {t.subGoal} {activeSection + 1}: {data.subGoals[activeSection] || '(미입력)'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {data.actions[activeSection].map((action, i) => (
                  <input
                    key={i}
                    type="text"
                    value={action}
                    onChange={(e) => updateAction(activeSection, i, e.target.value)}
                    placeholder={`${t.action} ${i + 1}`}
                    className="p-2 border rounded text-sm"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
