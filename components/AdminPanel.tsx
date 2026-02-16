
import React, { useState } from 'react';
import { CLASSES, SUBJECTS, CONTENT_TYPES } from '../constants';
import { saveAdminUpload } from '../services/contentService';

const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState({
    class: CLASSES[0],
    subject: SUBJECTS[0],
    chapter: '',
    contentType: CONTENT_TYPES[0],
    content: ''
  });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chapter || !formData.content) return;

    saveAdminUpload({
      class: formData.class,
      subject: formData.subject,
      chapter: formData.chapter,
      contentType: formData.contentType,
      content: formData.content,
      fileName: `ManualEntry_${Date.now()}.txt`
    });

    setStatus('Content successfully added to repository.');
    setFormData({ ...formData, content: '', chapter: '' });
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <h2 className="text-lg font-semibold text-indigo-900">Admin Content Ingestion</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Identifier</label>
          <input
            type="text"
            placeholder="e.g. Chapter 1: Matter"
            value={formData.chapter}
            onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
          <select
            value={formData.contentType}
            onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Raw Content (Text to Ingest)</label>
          <textarea
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Paste notes, question bank text, or specific CBSE material here..."
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2 flex justify-between items-center">
          {status && <span className="text-sm text-green-600 font-medium">{status}</span>}
          <button
            type="submit"
            className="ml-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md font-medium"
          >
            Ingest Content
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;
