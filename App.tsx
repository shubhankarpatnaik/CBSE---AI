
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import AdminPanel from './components/AdminPanel';
import ResultViewer from './components/ResultViewer';
import ChatWindow from './components/ChatWindow';
import { SYLLABUS_DATA, CLASSES, SUBJECTS_MAP } from './constants';
import { OutputType, GenerationRequest, Chapter } from './types';
import { generateStudyContent } from './services/geminiService';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const [selection, setSelection] = useState({
    class: '', // Default no preselection
    subject: '',
    chapterIdx: -1,
    subTopic: '',
    outputType: OutputType.SUMMARY,
    focusAreas: ''
  });

  const availableSubjects = selection.class ? SUBJECTS_MAP[selection.class] : [];
  
  const currentSyllabus = useMemo(() => {
    return SYLLABUS_DATA.find(s => s.class === selection.class && s.subject === selection.subject);
  }, [selection.class, selection.subject]);

  const availableChapters = currentSyllabus?.chapters || [];
  const currentChapter = availableChapters[selection.chapterIdx];
  const availableSubTopics = currentChapter?.subTopics || [];

  // Group chapters for Social Science
  const groupedChapters = useMemo(() => {
    if (selection.subject !== 'Social Science') return { all: availableChapters };
    const groups: Record<string, typeof availableChapters> = {};
    availableChapters.forEach(ch => {
      const book = ch.book || 'Others';
      if (!groups[book]) groups[book] = [];
      groups[book].push(ch);
    });
    return groups;
  }, [availableChapters, selection.subject]);

  const handleGenerate = async () => {
    if (!currentChapter) return;

    setLoading(true);
    setError(null);
    setResult('');

    try {
      const request: GenerationRequest = {
        class: selection.class,
        subject: selection.subject,
        chapter: currentChapter,
        subTopic: selection.subTopic,
        outputType: selection.outputType,
        focusAreas: selection.focusAreas
      };
      
      const content = await generateStudyContent(request);
      setResult(content);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <Header onAdminUnlock={setIsAdmin} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {isAdmin && <AdminPanel />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuration Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 p-6 space-y-5 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b dark:border-slate-800 pb-3">Selection Matrix</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Class</label>
                <select
                  value={selection.class}
                  onChange={(e) => setSelection({ ...selection, class: e.target.value, subject: '', chapterIdx: -1, subTopic: '' })}
                  className="w-full rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-3 px-4 focus:ring-2 ring-indigo-500 text-sm font-medium dark:text-white transition-all"
                >
                  <option value="">-- Choose Class --</option>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <select
                  disabled={!selection.class}
                  value={selection.subject}
                  onChange={(e) => setSelection({ ...selection, subject: e.target.value, chapterIdx: -1, subTopic: '' })}
                  className="w-full rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-3 px-4 focus:ring-2 ring-indigo-500 text-sm font-medium dark:text-white disabled:opacity-40 transition-all"
                >
                  <option value="">-- Choose Subject --</option>
                  {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">NCERT Chapter</label>
                <select
                  disabled={!selection.subject || availableChapters.length === 0}
                  value={selection.chapterIdx}
                  onChange={(e) => setSelection({ ...selection, chapterIdx: parseInt(e.target.value), subTopic: '' })}
                  className="w-full rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-3 px-4 focus:ring-2 ring-indigo-500 text-sm font-medium dark:text-white disabled:opacity-40 transition-all"
                >
                  <option value="-1">-- Select Chapter --</option>
                  {/* Fixed typing for Object.entries to resolve 'unknown' map error */}
                  {(Object.entries(groupedChapters) as [string, Chapter[]][]).map(([book, chapters]) => (
                    <optgroup label={book} key={book} className="text-indigo-600 dark:text-indigo-400">
                      {chapters.map((ch) => (
                        <option key={ch.number} value={availableChapters.indexOf(ch)}>
                          {ch.number}: {ch.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Specific Sub-Topic (Optional)</label>
                <select
                  disabled={selection.chapterIdx === -1 || availableSubTopics.length === 0}
                  value={selection.subTopic}
                  onChange={(e) => setSelection({ ...selection, subTopic: e.target.value })}
                  className="w-full rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-3 px-4 focus:ring-2 ring-indigo-500 text-sm font-medium dark:text-white disabled:opacity-40 transition-all"
                >
                  <option value="">All Subtopics (Full Chapter)</option>
                  {availableSubTopics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Desired Learning Asset</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(OutputType).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelection({ ...selection, outputType: type })}
                      className={`text-xs py-2.5 px-4 rounded-xl border font-semibold transition-all text-left flex items-center justify-between ${
                        selection.outputType === type
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md translate-x-1'
                          : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {type}
                      {selection.outputType === type && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || selection.chapterIdx === -1}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                    <span>Processing Syllabus...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>Execute Engine</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white overflow-hidden relative border border-indigo-500/20">
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2 flex items-center">
                  <span className="bg-indigo-500 p-1 rounded-md mr-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM14.243 14.243a1 1 0 101.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5.757 14.243a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707z" /></svg>
                  </span>
                  Exam Strategy
                </h4>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Use "Mock Questions" to identify high-weightage topics. Then switch to "Full Explanation" for gaps in your understanding.
                </p>
              </div>
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Result Engine */}
          <div className="lg:col-span-8">
            <ResultViewer 
              content={result} 
              loading={loading} 
              onOpenChat={() => setChatOpen(true)}
            />
          </div>
        </div>
      </main>

      {chatOpen && currentChapter && (
        <ChatWindow 
          chapterInfo={`${selection.subject}: ${currentChapter.name} (${selection.class})`}
          onClose={() => setChatOpen(false)}
        />
      )}

      <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            CBSE AI Study Copilot &bull; Production Grade EdTech
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>NCERT Verified</span>
            </div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Class 9 & 10 Logic</span>
            </div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Zero-Hallucination Guard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
