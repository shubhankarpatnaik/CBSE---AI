
import React from 'react';

interface ResultViewerProps {
  content: string;
  loading: boolean;
  onOpenChat: () => void;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ content, loading, onOpenChat }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-slate-800 p-12 flex flex-col items-center justify-center min-h-[500px] transition-colors">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-semibold mt-6 animate-pulse">Mapping NCERT Context...</p>
        <p className="text-sm text-gray-400 mt-2 text-center max-w-xs">Building exam-ready resources with zero-hallucination guardrails.</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center min-h-[500px] transition-colors">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Select Class & Subject to begin learning.</p>
        <p className="text-sm text-gray-400 mt-2">Expert AI guidance for CBSE students.</p>
      </div>
    );
  }

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-6 mb-2">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b dark:border-slate-700 pb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-gray-900 dark:text-white mt-10 mb-6">{line.replace('# ', '')}</h1>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 mb-2 text-gray-700 dark:text-gray-300 list-disc">{line.substring(2)}</li>;
      if (line.match(/^\d+\./)) return <div key={i} className="ml-4 mb-2 text-gray-700 dark:text-gray-300 font-medium">{line}</div>;
      if (line.trim() === '') return <div key={i} className="h-4" />;
      return <p key={i} className="mb-3 text-gray-800 dark:text-gray-200 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border dark:border-slate-800 overflow-hidden transition-colors flex flex-col min-h-[600px]">
      <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center shrink-0">
        <h3 className="text-white font-semibold">NCERT Study Engine Output</h3>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenChat}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm flex items-center space-x-2 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            <span>Ask Doubt</span>
          </button>
          <button 
            onClick={() => window.print()} 
            className="text-white/80 hover:text-white p-1 rounded transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          </button>
        </div>
      </div>
      <div className="p-8 md:p-12 prose dark:prose-invert max-w-none print:p-0 overflow-y-auto">
        {formatContent(content)}
      </div>
      <div className="bg-gray-50 dark:bg-slate-800/50 border-t dark:border-slate-800 px-8 py-4 text-[10px] text-gray-400 text-center italic mt-auto">
        Deterministic Output System: Content is derived strictly from NCERT & internal repositories. Verified for Class 9/10 CBSE standards.
      </div>
    </div>
  );
};

export default ResultViewer;
