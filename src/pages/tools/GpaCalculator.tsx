import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AdBanner from '../../components/AdBanner';
import { siteConfig } from '../../config/siteConfig';
import useLocalizedContent from '../../hooks/useLocalizedContent';

// 학점 점수 매핑
const GRADE_POINTS: Record<string, number> = {
  'A+': 4.5, 'A0': 4.0, 'A': 4.0,
  'B+': 3.5, 'B0': 3.0, 'B': 3.0,
  'C+': 2.5, 'C0': 2.0, 'C': 2.0,
  'D+': 1.5, 'D0': 1.0, 'D': 1.0,
  'F': 0, 'P': -1, 'NP': -1, // P/NP는 계산에서 제외
};

const GRADE_OPTIONS = ['A+', 'A0', 'B+', 'B0', 'C+', 'C0', 'D+', 'D0', 'F', 'P'];
const CREDIT_OPTIONS = [1, 2, 3, 4];

interface Course {
  id: number;
  name: string;
  credit: number;
  grade: string;
}

const i18n = {
  ko: {
    title: '학점 계산기',
    description: '대학교 평균 학점(GPA)을 쉽게 계산합니다. 과목별 학점과 성적을 입력하세요.',
    courseName: '과목명',
    credit: '학점',
    grade: '성적',
    addCourse: '+ 과목 추가',
    calculate: '계산하기',
    reset: '초기화',
    result: '계산 결과',
    averageGPA: '평균 학점',
    totalCredits: '총 이수 학점',
    totalCourses: '과목 수',
    maxGPA: '4.5 만점 기준',
    faq: {
      title: '자주 묻는 질문',
      items: [
        {
          question: '평균 학점은 어떻게 계산하나요?',
          answer: '(각 과목의 학점 × 성적 점수)의 합 ÷ 총 학점으로 계산합니다. 예: (3학점×4.5 + 2학점×4.0) ÷ 5학점 = 4.3',
        },
        {
          question: 'P/F(Pass/Fail) 과목은 어떻게 처리되나요?',
          answer: 'P(Pass) 과목은 학점은 인정되지만 평균 학점 계산에서는 제외됩니다. F(Fail)은 0점으로 계산됩니다.',
        },
        {
          question: '4.3 만점과 4.5 만점의 차이는 무엇인가요?',
          answer: '학교마다 기준이 다릅니다. 4.5 만점 학교는 A+가 4.5점이고, 4.3 만점 학교는 A+가 4.3점입니다. 이 계산기는 4.5 만점 기준입니다.',
        },
      ],
    },
  },
  en: {
    title: 'GPA Calculator',
    description: 'Easily calculate your university GPA. Enter credits and grades for each course.',
    courseName: 'Course Name',
    credit: 'Credits',
    grade: 'Grade',
    addCourse: '+ Add Course',
    calculate: 'Calculate',
    reset: 'Reset',
    result: 'Calculation Result',
    averageGPA: 'Average GPA',
    totalCredits: 'Total Credits',
    totalCourses: 'Number of Courses',
    maxGPA: 'Based on 4.5 scale',
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How is GPA calculated?',
          answer: 'GPA is calculated by dividing the sum of (credits × grade points) by total credits. Example: (3 credits × 4.5 + 2 credits × 4.0) ÷ 5 credits = 4.3',
        },
        {
          question: 'How are P/F (Pass/Fail) courses handled?',
          answer: 'P (Pass) courses count toward credits earned but are excluded from GPA calculation. F (Fail) is calculated as 0 points.',
        },
        {
          question: 'What is the difference between 4.3 and 4.5 scale?',
          answer: 'Different universities use different scales. On a 4.5 scale, A+ equals 4.5 points. On a 4.3 scale, A+ equals 4.3 points. This calculator uses the 4.5 scale.',
        },
      ],
    },
  },
};

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', credit: 3, grade: 'A+' },
    { id: 2, name: '', credit: 3, grade: 'A0' },
    { id: 3, name: '', credit: 3, grade: 'B+' },
  ]);
  const [result, setResult] = useState<{ gpa: number; totalCredits: number } | null>(null);
  const { t } = useLocalizedContent(i18n);

  const toolInfo = siteConfig.tools.find((tool) => tool.id === 'gpa-calculator');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    description: toolInfo?.description,
    url: `${siteConfig.siteUrl}${toolInfo?.path}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const addCourse = () => {
    const newId = Math.max(...courses.map((c) => c.id), 0) + 1;
    setCourses([...courses, { id: newId, name: '', credit: 3, grade: 'A0' }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const calculate = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const gradePoint = GRADE_POINTS[course.grade];
      if (gradePoint >= 0) { // P는 -1이므로 제외
        totalPoints += course.credit * gradePoint;
        totalCredits += course.credit;
      }
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setResult({ gpa, totalCredits });
  };

  const handleReset = () => {
    setCourses([
      { id: 1, name: '', credit: 3, grade: 'A+' },
      { id: 2, name: '', credit: 3, grade: 'A0' },
      { id: 3, name: '', credit: 3, grade: 'B+' },
    ]);
    setResult(null);
  };

  const getGpaColor = (gpa: number) => {
    if (gpa >= 4.0) return 'text-green-600';
    if (gpa >= 3.5) return 'text-blue-600';
    if (gpa >= 3.0) return 'text-yellow-600';
    if (gpa >= 2.0) return 'text-orange-600';
    return 'text-red-600';
  };

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
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.description}</p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* 과목 목록 */}
          <div className="space-y-4 mb-6">
            <div className="hidden md:grid md:grid-cols-12 gap-3 text-sm font-medium text-gray-600 px-2">
              <div className="col-span-5">{t.courseName}</div>
              <div className="col-span-2 text-center">{t.credit}</div>
              <div className="col-span-3 text-center">{t.grade}</div>
              <div className="col-span-2"></div>
            </div>

            {courses.map((course, index) => (
              <div key={course.id} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                <div className="col-span-12 md:col-span-5">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    placeholder={`과목 ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <select
                    value={course.credit}
                    onChange={(e) => updateCourse(course.id, 'credit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {CREDIT_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}학점</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-5 md:col-span-3">
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g} ({GRADE_POINTS[g] >= 0 ? GRADE_POINTS[g] : '-'})</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3 md:col-span-2 text-right">
                  <button
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length <= 1}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 버튼들 */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={addCourse}
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              {t.addCourse}
            </button>
            <div className="flex-1"></div>
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t.reset}
            </button>
            <button
              onClick={calculate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t.calculate}
            </button>
          </div>
        </section>

        {/* 결과 */}
        {result && (
          <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{t.result}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm text-center border-2 border-blue-500">
                <div className="text-sm text-blue-600 font-medium mb-1">{t.averageGPA}</div>
                <div className={`text-5xl font-bold ${getGpaColor(result.gpa)}`}>
                  {result.gpa.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 mt-1">{t.maxGPA}</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-sm text-gray-600 font-medium mb-1">{t.totalCredits}</div>
                <div className="text-4xl font-bold text-gray-700">{result.totalCredits}</div>
                <div className="text-sm text-gray-500 mt-1">학점</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-sm text-gray-600 font-medium mb-1">{t.totalCourses}</div>
                <div className="text-4xl font-bold text-gray-700">{courses.length}</div>
                <div className="text-sm text-gray-500 mt-1">과목</div>
              </div>
            </div>
          </section>
        )}

        <AdBanner slot="5555555555" format="rectangle" className="my-8" />

        {/* FAQ */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.faq.title}</h2>
          <div className="space-y-6">
            {t.faq.items.map((item, index) => (
              <article key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Q. {item.question}</h3>
                <p className="text-gray-600 leading-relaxed">A. {item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 설명 콘텐츠 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">학점 계산기 사용법</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              이 <strong>학점 계산기</strong>는 대학생들이 한 학기 또는 전체 학점 평균(GPA)을 쉽게 계산할 수 있는 도구입니다.
              과목별 학점(이수 단위)과 성적을 입력하면 자동으로 평균 학점을 계산해드립니다.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">성적별 점수 (4.5 만점 기준)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-sm">
              <div className="bg-gray-50 p-2 rounded">A+ = 4.5</div>
              <div className="bg-gray-50 p-2 rounded">A0 = 4.0</div>
              <div className="bg-gray-50 p-2 rounded">B+ = 3.5</div>
              <div className="bg-gray-50 p-2 rounded">B0 = 3.0</div>
              <div className="bg-gray-50 p-2 rounded">C+ = 2.5</div>
              <div className="bg-gray-50 p-2 rounded">C0 = 2.0</div>
              <div className="bg-gray-50 p-2 rounded">D+ = 1.5</div>
              <div className="bg-gray-50 p-2 rounded">D0 = 1.0</div>
              <div className="bg-gray-50 p-2 rounded">F = 0</div>
              <div className="bg-gray-50 p-2 rounded">P = 제외</div>
            </div>
          </div>
        </section>

        {/* 관련 도구 */}
        <section className="bg-gray-50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔗 관련 도구</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/tools/percent-calculator" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">퍼센트 계산기</h3>
              <p className="text-sm text-gray-600 mt-1">비율, 증감률 계산</p>
            </Link>
            <Link to="/tools/character-counter" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600">글자수 세기</h3>
              <p className="text-sm text-gray-600 mt-1">자기소개서 글자수 확인</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
