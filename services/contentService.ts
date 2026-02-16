
import { AdminUpload } from '../types';

const STORAGE_KEY = 'cbse_copilot_admin_uploads';

export const getAdminUploads = (): AdminUpload[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAdminUpload = (upload: Omit<AdminUpload, 'id' | 'timestamp'>) => {
  const current = getAdminUploads();
  const newUpload: AdminUpload = {
    ...upload,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, newUpload]));
  return newUpload;
};

export const findRelevantUploads = (className: string, subject: string, chapter: string) => {
  const all = getAdminUploads();
  return all.filter(u => 
    u.class === className && 
    u.subject === subject && 
    (u.chapter.includes(chapter) || chapter.includes(u.chapter))
  );
};
