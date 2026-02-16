
import React, { useState, useEffect, useRef } from 'react';
import { startChapterChat } from '../services/geminiService';

interface ChatWindowProps {
  chapterInfo: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chapterInfo, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startChapterChat(chapterInfo);
  }, [chapterInfo]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: Failed to reach the AI expert." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col z-[100] overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-bold text-sm">Chapter AI Expert</h3>
          <p className="text-[10px] opacity-80">{chapterInfo}</p>
        </div>
        <button onClick={onClose} className="hover:bg-indigo-500 p-1 rounded transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-slate-900 scroll-smooth">
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-50 dark:text-white text-sm">
            Ask any doubt related to this chapter!
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white dark:bg-slate-700 dark:text-gray-100 shadow-sm border dark:border-slate-600 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs italic text-indigo-500 px-2 animate-pulse">Expert is typing...</div>}
      </div>

      <div className="p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your doubt..."
            className="flex-grow bg-gray-100 dark:bg-slate-700 dark:text-white border-none focus:ring-2 ring-indigo-500 rounded-xl px-4 py-2 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
