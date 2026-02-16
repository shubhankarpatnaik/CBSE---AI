
export enum OutputType {
  SUMMARY = 'Summary',
  MIND_MAP = 'Mind Map',
  REVISION_PLAN = 'Daily Revision Plan',
  MOCK_QUESTIONS = 'Mock Questions',
  FULL_EXPLANATION = 'Full Chapter Explanation'
}

export interface Chapter {
  number: string;
  name: string;
  book?: string; // For Social Science subdivision
  keyTerms: string[];
  subTopics?: string[];
}

export interface SyllabusItem {
  class: string;
  subject: string;
  chapters: Chapter[];
}

export interface GenerationRequest {
  class: string;
  subject: string;
  chapter: Chapter;
  subTopic?: string;
  focusAreas?: string;
  outputType: OutputType;
}

export interface AdminUpload {
  id: string;
  fileName: string;
  class: string;
  subject: string;
  chapter: string;
  contentType: string;
  content: string;
  timestamp: number;
}
