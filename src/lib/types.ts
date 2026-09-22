export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  sources?: SourceCard[];
  situationProfile?: SituationProfile;
  createdAt: string;
}

export interface SourceCard {
  type: 'quran' | 'hadith' | 'tafsir' | 'story' | 'dua';
  data: QuranSource | HadithSource | TafsirSource | StorySource | DuaSource;
  citation: string;
  verified: boolean;
}

export interface QuranSource {
  verseKey: string;
  arabicUthmani: string;
  translation: string;
  translatorName: string;
  tafsirExcerpt?: string;
}

export interface HadithSource {
  collection: string;
  hadithNumber: string;
  arabicMatn: string;
  englishText: string;
  grade: string;
  grader: string;
  explanation?: string;
}

export interface TafsirSource {
  tafsirName: string;
  author: string;
  text: string;
  verseKey: string;
}

export interface StorySource {
  title: string;
  figure: string;
  content: string;
  sourceType: string;
}

export interface DuaSource {
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  sourceReference: string;
  occasion?: string;
}

export interface StreamChunk {
  type: 'text' | 'source_card' | 'done' | 'error';
  content?: string | SourceCard;
}

export interface SessionInfo {
  id: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface SituationProfile {
  primaryEmotion: string;
  secondaryEmotions?: string[];
  situations?: string[];
  spiritualContext?: string;
  risk?: 'none' | 'low' | 'medium' | 'high' | 'crisis';
}

export interface SafetyResult {
  isSafe: boolean;
  isCrisis: boolean;
  riskCategory?: string;
  action?: 'none' | 'flag' | 'block' | 'escalate';
}

export interface FeedbackPayload {
  messageId: string;
  responseHelpful: boolean;
  responseTone?: 'Appropriate' | 'Too preachy' | 'Too generic' | 'Didn\'t understand me';
  comment?: string;
}
