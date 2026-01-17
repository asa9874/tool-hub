import { useState, useEffect, useRef, useCallback } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '웹 타이머 & 스톱워치',
    description: '뽀모도로 타이머, 스톱워치, 카운트다운 기능을 제공합니다',
    timer: '타이머',
    stopwatch: '스톱워치',
    pomodoro: '뽀모도로',
    start: '시작',
    pause: '일시정지',
    resume: '계속',
    reset: '리셋',
    lap: '랩',
    setTime: '시간 설정',
    hours: '시간',
    minutes: '분',
    seconds: '초',
    presets: '프리셋',
    laps: '랩 기록',
    pomodoroWork: '집중 시간',
    pomodoroBreak: '휴식 시간',
    pomodoroLongBreak: '긴 휴식',
    pomodoroSession: '세션',
    pomodoroComplete: '완료!',
    notification: '알림음',
    fullscreen: '전체화면',
  },
  en: {
    title: 'Web Timer & Stopwatch',
    description: 'Pomodoro timer, stopwatch, and countdown features',
    timer: 'Timer',
    stopwatch: 'Stopwatch',
    pomodoro: 'Pomodoro',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    lap: 'Lap',
    setTime: 'Set Time',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    presets: 'Presets',
    laps: 'Laps',
    pomodoroWork: 'Work',
    pomodoroBreak: 'Break',
    pomodoroLongBreak: 'Long Break',
    pomodoroSession: 'Session',
    pomodoroComplete: 'Complete!',
    notification: 'Sound',
    fullscreen: 'Fullscreen',
  }
};

type Mode = 'timer' | 'stopwatch' | 'pomodoro';
type PomodoroPhase = 'work' | 'break' | 'longBreak';

export default function WebTimer() {
  const { t } = useLocalizedContent(i18n);
  const [mode, setMode] = useState<Mode>('timer');
  const [time, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // 타이머 설정
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  
  // 뽀모도로 설정
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work');
  const [pomodoroSession, setPomodoroSession] = useState(1);
  const [workDuration] = useState(25);
  const [breakDuration] = useState(5);
  const [longBreakDuration] = useState(15);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const playSound = useCallback(() => {
    if (soundEnabled) {
      // 간단한 비프음
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      setTimeout(() => osc.stop(), 200);
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (mode === 'stopwatch') {
            return prev + 10;
          } else {
            if (prev <= 0) {
              playSound();
              setIsRunning(false);
              if (mode === 'pomodoro') {
                // 다음 페이즈로
                if (pomodoroPhase === 'work') {
                  if (pomodoroSession % 4 === 0) {
                    setPomodoroPhase('longBreak');
                    return longBreakDuration * 60 * 1000;
                  } else {
                    setPomodoroPhase('break');
                    return breakDuration * 60 * 1000;
                  }
                } else {
                  setPomodoroPhase('work');
                  setPomodoroSession(s => s + 1);
                  return workDuration * 60 * 1000;
                }
              }
              return 0;
            }
            return prev - 10;
          }
        });
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, pomodoroPhase, pomodoroSession, workDuration, breakDuration, longBreakDuration, playSound]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    if (mode === 'stopwatch') {
      return `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    return `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (mode === 'timer') {
      const ms = (timerHours * 3600 + timerMinutes * 60 + timerSeconds) * 1000;
      setTime(ms);
      setInitialTime(ms);
    } else if (mode === 'pomodoro') {
      setTime(workDuration * 60 * 1000);
      setInitialTime(workDuration * 60 * 1000);
      setPomodoroPhase('work');
    }
    setIsRunning(true);
  };

  const handleLap = () => {
    setLaps(prev => [time, ...prev]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    if (mode === 'pomodoro') {
      setPomodoroSession(1);
      setPomodoroPhase('work');
    }
  };

  const progress = mode !== 'stopwatch' && initialTime > 0 
    ? ((initialTime - time) / initialTime) * 100 
    : 0;

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white">
          <h1 className="text-2xl font-bold text-center mb-2">{t.title}</h1>
          <p className="text-slate-300 text-center mb-6">{t.description}</p>

          {/* 모드 선택 */}
          <div className="flex justify-center gap-2 mb-8">
            {(['timer', 'stopwatch', 'pomodoro'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  handleReset();
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === m 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {t[m]}
              </button>
            ))}
          </div>

          {/* 시간 표시 */}
          <div className="relative mb-8">
            {mode !== 'stopwatch' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-64 h-64 transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="8"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke={pomodoroPhase === 'work' ? '#3B82F6' : '#22C55E'}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-100"
                  />
                </svg>
              </div>
            )}
            <div className="text-center py-16">
              <p className="text-6xl font-mono font-bold tracking-wider">
                {formatTime(time)}
              </p>
              {mode === 'pomodoro' && (
                <p className="text-slate-400 mt-2">
                  {t[`pomodoro${pomodoroPhase.charAt(0).toUpperCase()}${pomodoroPhase.slice(1)}` as keyof typeof t]} | {t.pomodoroSession} {pomodoroSession}
                </p>
              )}
            </div>
          </div>

          {/* 타이머 설정 */}
          {mode === 'timer' && !isRunning && time === 0 && (
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-2 text-center">{t.setTime}</p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={timerHours}
                    onChange={(e) => setTimerHours(Number(e.target.value))}
                    className="w-16 p-2 text-center text-2xl bg-slate-700 rounded"
                  />
                  <p className="text-xs text-slate-400 mt-1">{t.hours}</p>
                </div>
                <span className="text-2xl self-start pt-2">:</span>
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Number(e.target.value))}
                    className="w-16 p-2 text-center text-2xl bg-slate-700 rounded"
                  />
                  <p className="text-xs text-slate-400 mt-1">{t.minutes}</p>
                </div>
                <span className="text-2xl self-start pt-2">:</span>
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Number(e.target.value))}
                    className="w-16 p-2 text-center text-2xl bg-slate-700 rounded"
                  />
                  <p className="text-xs text-slate-400 mt-1">{t.seconds}</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <p className="text-xs text-slate-400">{t.presets}:</p>
                {[1, 3, 5, 10, 15, 25, 30].map(m => (
                  <button
                    key={m}
                    onClick={() => { setTimerMinutes(m); setTimerHours(0); setTimerSeconds(0); }}
                    className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600"
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 컨트롤 */}
          <div className="flex justify-center gap-3">
            {mode === 'stopwatch' ? (
              <>
                {!isRunning ? (
                  <button
                    onClick={() => setIsRunning(true)}
                    className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    {time > 0 ? t.resume : t.start}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRunning(false)}
                    className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    {t.pause}
                  </button>
                )}
                {isRunning && (
                  <button
                    onClick={handleLap}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {t.lap}
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500"
                >
                  {t.reset}
                </button>
              </>
            ) : (
              <>
                {!isRunning ? (
                  <button
                    onClick={time > 0 ? () => setIsRunning(true) : startTimer}
                    className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    {time > 0 ? t.resume : t.start}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRunning(false)}
                    className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    {t.pause}
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500"
                >
                  {t.reset}
                </button>
              </>
            )}
          </div>

          {/* 옵션 */}
          <div className="flex justify-center mt-4">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              {t.notification}
            </label>
          </div>

          {/* 랩 기록 */}
          {laps.length > 0 && (
            <div className="mt-6 p-4 bg-slate-700 rounded-lg max-h-48 overflow-auto">
              <h3 className="text-sm font-medium text-slate-400 mb-2">{t.laps}</h3>
              {laps.map((lap, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-slate-600">
                  <span className="text-slate-400">#{laps.length - i}</span>
                  <span className="font-mono">{formatTime(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
