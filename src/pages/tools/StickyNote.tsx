import { useState, useEffect, useRef } from 'react';
import SEO from '../../components/SEO';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

const i18n = {
  ko: {
    title: '임시 메모장',
    description: '로그인 없이 브라우저에 텍스트를 임시 저장하는 간단한 메모장',
    placeholder: '여기에 메모를 입력하세요...',
    autoSave: '자동 저장됨',
    lastSaved: '마지막 저장',
    clear: '모두 지우기',
    copy: '복사하기',
    copied: '복사됨!',
    download: '다운로드',
    characters: '글자',
    words: '단어',
    lines: '줄',
    newNote: '새 메모',
    notes: '메모 목록',
    untitled: '제목 없음',
    deleteNote: '삭제',
    confirmDelete: '이 메모를 삭제하시겠습니까?',
    darkMode: '다크 모드',
    fontSize: '글자 크기',
  },
  en: {
    title: 'Sticky Note Online',
    description: 'Simple notepad to temporarily save text in your browser without login',
    placeholder: 'Type your notes here...',
    autoSave: 'Auto-saved',
    lastSaved: 'Last saved',
    clear: 'Clear All',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Download',
    characters: 'characters',
    words: 'words',
    lines: 'lines',
    newNote: 'New Note',
    notes: 'Notes',
    untitled: 'Untitled',
    deleteNote: 'Delete',
    confirmDelete: 'Delete this note?',
    darkMode: 'Dark Mode',
    fontSize: 'Font Size',
  }
};

interface Note {
  id: string;
  content: string;
  title: string;
  updatedAt: number;
}

const STORAGE_KEY = 'sticky-notes';

export default function StickyNote() {
  const { t } = useLocalizedContent(i18n);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedNotes: Note[] = JSON.parse(saved);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setActiveNoteId(parsedNotes[0].id);
        setContent(parsedNotes[0].content);
      }
    } else {
      // 기본 메모 생성
      const defaultNote: Note = {
        id: Date.now().toString(),
        content: '',
        title: t.untitled,
        updatedAt: Date.now(),
      };
      setNotes([defaultNote]);
      setActiveNoteId(defaultNote.id);
    }
  }, []);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (activeNoteId) {
        const updatedNotes = notes.map(note =>
          note.id === activeNoteId
            ? {
                ...note,
                content,
                title: content.split('\n')[0].slice(0, 30) || t.untitled,
                updatedAt: Date.now(),
              }
            : note
        );
        setNotes(updatedNotes);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
        setLastSaved(new Date());
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, activeNoteId]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      title: t.untitled,
      updatedAt: Date.now(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setActiveNoteId(newNote.id);
    setContent('');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const selectNote = (note: Note) => {
    setActiveNoteId(note.id);
    setContent(note.content);
  };

  const deleteNote = (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    if (activeNoteId === id) {
      if (updatedNotes.length > 0) {
        setActiveNoteId(updatedNotes[0].id);
        setContent(updatedNotes[0].content);
      } else {
        createNewNote();
      }
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadNote = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content.split('\n').length;

  return (
    <>
      <SEO title={t.title} description={t.description} />
      <div className="max-w-5xl mx-auto p-4">
        <div className={`rounded-2xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t.title}
                </h1>
                {lastSaved && (
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t.autoSave} • {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className={`px-2 py-1 rounded text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
                >
                  {[12, 14, 16, 18, 20, 24].map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t.darkMode}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* 메모 목록 사이드바 */}
            <div className={`w-48 border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-2`}>
              <button
                onClick={createNewNote}
                className="w-full py-2 px-3 mb-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                + {t.newNote}
              </button>
              <div className="space-y-1 max-h-96 overflow-auto">
                {notes.map(note => (
                  <div
                    key={note.id}
                    className={`group p-2 rounded cursor-pointer flex justify-between items-center ${
                      activeNoteId === note.id
                        ? 'bg-blue-100 text-blue-800'
                        : darkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => selectNote(note)}
                  >
                    <div className="truncate flex-1 text-sm">
                      {note.title}
                    </div>
                    {notes.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 메모 영역 */}
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.placeholder}
                className={`w-full h-96 p-4 resize-none focus:outline-none ${
                  darkMode ? 'bg-gray-900 text-gray-100 placeholder-gray-600' : 'bg-white text-gray-800'
                }`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
              />
            </div>
          </div>

          {/* 하단 바 */}
          <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {content.length} {t.characters} • {wordCount} {t.words} • {lineCount} {t.lines}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setContent('')}
                className={`px-3 py-1 text-sm rounded ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {t.clear}
              </button>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 text-sm rounded ${
                  copied ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {copied ? t.copied : t.copy}
              </button>
              <button
                onClick={downloadNote}
                className={`px-3 py-1 text-sm rounded ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {t.download}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
