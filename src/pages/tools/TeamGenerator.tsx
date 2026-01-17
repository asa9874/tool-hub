import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '랜덤 조/팀 나누기',
    description: '참여자 명단을 입력하고 팀 수를 정하면 공평하게 그룹을 생성합니다',
    membersLabel: '참여자 명단 (줄바꿈으로 구분)',
    membersPlaceholder: '홍길동\n김철수\n이영희\n박민수\n최지영\n정수민',
    teamCountLabel: '팀 수',
    generateButton: '팀 나누기',
    shuffleButton: '다시 섞기',
    copyButton: '결과 복사',
    copied: '복사됨!',
    team: '팀',
    totalMembers: '총 참여자',
    people: '명',
    minMembers: '최소 2명 이상의 참여자를 입력하세요',
    minTeams: '팀 수는 참여자 수보다 작아야 합니다',
    result: '팀 배정 결과',
  },
  en: {
    title: 'Random Team Generator',
    description: 'Enter participant names and number of teams to create balanced groups',
    membersLabel: 'Participants (one per line)',
    membersPlaceholder: 'John\nJane\nMike\nSarah\nTom\nEmma',
    teamCountLabel: 'Number of Teams',
    generateButton: 'Generate Teams',
    shuffleButton: 'Reshuffle',
    copyButton: 'Copy Result',
    copied: 'Copied!',
    team: 'Team',
    totalMembers: 'Total Participants',
    people: '',
    minMembers: 'Please enter at least 2 participants',
    minTeams: 'Number of teams must be less than participants',
    result: 'Team Assignment Result',
  }
};

const TEAM_COLORS = [
  'from-red-400 to-red-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-orange-500',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
];

export default function TeamGenerator() {
  const { t } = useLocalizedContent(i18n);
  const [inputText, setInputText] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const members = inputText.split('\n').filter(m => m.trim() !== '');

  const generateTeams = () => {
    if (members.length < 2 || teamCount > members.length) return;

    setIsAnimating(true);
    
    // 셔플 애니메이션을 위한 딜레이
    setTimeout(() => {
      // Fisher-Yates 셔플
      const shuffled = [...members];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // 팀 배정
      const newTeams: string[][] = Array.from({ length: teamCount }, () => []);
      shuffled.forEach((member, index) => {
        newTeams[index % teamCount].push(member);
      });

      setTeams(newTeams);
      setIsAnimating(false);
    }, 500);
  };

  const copyResult = () => {
    if (teams.length === 0) return;

    const text = teams
      .map((team, index) => `${t.team} ${index + 1}:\n${team.map(m => `  - ${m}`).join('\n')}`)
      .join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isValid = members.length >= 2 && teamCount <= members.length && teamCount >= 2;

  return (
    <>
      <SEO
        title={t.title}
        description={t.description}
        keywords={['팀 나누기', '조 편성', '랜덤 팀', '그룹 나누기', '팀빌딩', 'team generator']}
        canonical="/tools/team-generator"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 입력 영역 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.membersLabel}
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.membersPlaceholder}
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t.totalMembers}: {members.length}{t.people}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.teamCountLabel}
                </label>
                <input
                  type="number"
                  min={2}
                  max={Math.max(2, members.length)}
                  value={teamCount}
                  onChange={(e) => setTeamCount(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {members.length > 0 && members.length < 2 && (
                <p className="text-red-500 text-sm">{t.minMembers}</p>
              )}
              {members.length >= 2 && teamCount > members.length && (
                <p className="text-red-500 text-sm">{t.minTeams}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={generateTeams}
                  disabled={!isValid || isAnimating}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {teams.length > 0 ? t.shuffleButton : t.generateButton}
                </button>
                {teams.length > 0 && (
                  <button
                    onClick={copyResult}
                    className="py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {copied ? t.copied : t.copyButton}
                  </button>
                )}
              </div>
            </div>

            {/* 결과 영역 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.result}</h2>
              
              <AnimatePresence mode="wait">
                {isAnimating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-64"
                  >
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
                      <p className="text-gray-500">팀을 구성하는 중...</p>
                    </div>
                  </motion.div>
                ) : teams.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 max-h-[400px] overflow-y-auto pr-2"
                  >
                    {teams.map((team, teamIndex) => (
                      <motion.div
                        key={teamIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: teamIndex * 0.1 }}
                        className={`bg-gradient-to-r ${TEAM_COLORS[teamIndex % TEAM_COLORS.length]} rounded-xl p-4 text-white`}
                      >
                        <h3 className="font-bold text-lg mb-2">
                          {t.team} {teamIndex + 1}
                          <span className="ml-2 text-sm font-normal opacity-80">
                            ({team.length}{t.people})
                          </span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {team.map((member, memberIndex) => (
                            <motion.span
                              key={memberIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: teamIndex * 0.1 + memberIndex * 0.05 }}
                              className="px-3 py-1 bg-white/20 rounded-full text-sm"
                            >
                              {member}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <span className="text-6xl block mb-4">👥</span>
                      <p>참여자를 입력하고 팀을 나눠보세요</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
