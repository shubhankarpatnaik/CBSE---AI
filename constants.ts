
import { SyllabusItem } from './types';

export const CLASSES = ['Class 9', 'Class 10'];

// Added common subjects array to be used across the app
export const SUBJECTS = [
  'Science', 
  'Mathematics', 
  'Social Science', 
  'English Language & Literature', 
  'Hindi Course A', 
  'Sanskrit', 
  'Artificial Intelligence (417)'
];

export const SUBJECTS_MAP: Record<string, string[]> = {
  'Class 9': SUBJECTS,
  'Class 10': SUBJECTS
};

export const SYLLABUS_DATA: SyllabusItem[] = [
  // Class 9 Science
  {
    class: 'Class 9',
    subject: 'Science',
    chapters: [
      { number: '1', name: 'Matter in Our Surroundings', keyTerms: ['States of matter', 'Latent heat', 'Evaporation'], subTopics: ['Physical Nature of Matter', 'States of Matter', 'Change of State', 'Evaporation'] },
      { number: '2', name: 'Is Matter Around Us Pure', keyTerms: ['Mixture', 'Colloids', 'Concentration'], subTopics: ['Mixtures', 'Solutions', 'Separating Components', 'Physical and Chemical Changes'] },
      { number: '5', name: 'The Fundamental Unit of Life', keyTerms: ['Cell', 'Organelles', 'Osmosis'], subTopics: ['Cell Discovery', 'Plasma Membrane', 'Nucleus', 'Cell Organelles'] }
    ]
  },
  // Class 9 Social Science
  {
    class: 'Class 9',
    subject: 'Social Science',
    chapters: [
      // History
      { number: 'H1', name: 'The French Revolution', book: 'History', keyTerms: ['Estates General', 'Bastille', 'Jacobins'] },
      { number: 'H2', name: 'Socialism in Europe and the Russian Revolution', book: 'History', keyTerms: ['Tsar', 'Bolsheviks', 'February Revolution'] },
      // Geography
      { number: 'G1', name: 'India: Size and Location', book: 'Geography', keyTerms: ['Standard Meridian', 'Latitudinal Extent'] },
      { number: 'G2', name: 'Physical Features of India', book: 'Geography', keyTerms: ['Himalayas', 'Northern Plains', 'Peninsular Plateau'] },
      // Civics
      { number: 'C1', name: 'What is Democracy? Why Democracy?', book: 'Civics', keyTerms: ['Universal Adult Franchise', 'Accountability'] },
      // Economics
      { number: 'E1', name: 'The Story of Village Palampur', book: 'Economics', keyTerms: ['Factors of Production', 'Multiple Cropping'] }
    ]
  },
  // Class 10 Mathematics
  {
    class: 'Class 10',
    subject: 'Mathematics',
    chapters: [
      { number: '1', name: 'Real Numbers', keyTerms: ['Fundamental Theorem of Arithmetic', 'Irrationality'], subTopics: ['Fundamental Theorem of Arithmetic', 'Revisiting Irrational Numbers'] },
      { number: '4', name: 'Quadratic Equations', keyTerms: ['Roots', 'Discriminant', 'Nature of Roots'], subTopics: ['Quadratic Equations', 'Solution by Factorisation', 'Nature of Roots'] },
      { number: '6', name: 'Triangles', keyTerms: ['Similarity', 'BPT', 'Pythagoras Theorem'], subTopics: ['Similar Figures', 'Similarity of Triangles', 'Criteria for Similarity'] }
    ]
  },
  // Class 10 Social Science
  {
    class: 'Class 10',
    subject: 'Social Science',
    chapters: [
      { number: 'H1', name: 'Nationalism in Europe', book: 'History', keyTerms: ['Liberalism', 'Treaty of Vienna'] },
      { number: 'H2', name: 'Nationalism in India', book: 'History', keyTerms: ['Satyagraha', 'Non-Cooperation', 'Civil Disobedience'] },
      { number: 'G1', name: 'Resources and Development', book: 'Geography', keyTerms: ['Sustainability', 'Soil Erosion'] },
      { number: 'C1', name: 'Power Sharing', book: 'Civics', keyTerms: ['Belgium Model', 'Majoritarianism'] },
      { number: 'E1', name: 'Development', book: 'Economics', keyTerms: ['PCI', 'HDR', 'Sustainable Development'] }
    ]
  }
];

export const CONTENT_TYPES = [
  'Question Bank',
  'Notes',
  'MCQs',
  'Mind Map',
  'Revision Notes'
];
