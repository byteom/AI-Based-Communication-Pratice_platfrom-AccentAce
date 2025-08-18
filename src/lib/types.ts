
import type {AnalyzeAccentOutput} from '@/ai/flows/analyze-accent';
import type {AnalyzeToneOutput} from '@/ai/flows/analyze-tone';
import type {AnalyzeStoryOutput} from '@/ai/flows/analyze-story';
import type { Language, Accent, Difficulty, Emotion } from './accent-ace-config';
import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
    uid: string;
    email: string;
    displayName?: string;
    avatar?: string;
    isPremium: boolean;
    role?: 'admin';
    createdAt: Timestamp;
}

export type Coupon = {
    id: string;
    code: string;
    discountPercent: number;
    expiresAt: Timestamp;
    createdAt: Timestamp;
}

export type FeatureFlag = {
    id: string;
    isPremium: boolean;
}

export type AccentAceHistoryItem = {
  id: string;
  userId: string;
  phrase: string;
  language: Language;
  accent: Accent;
  difficulty: Difficulty;
  referenceAudioUrl: string;
  recordedAudioUrl?: string;
  analysis?: AnalyzeAccentOutput;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export type SentenceScrambleHistoryItem = {
  id: string;
  userId: string;
  scrambledSentence: string;
  correctSentence: string;
  scrambledAudioUrl: string;
  recordedAudioUrl?: string;
  analysis?: AnalyzeAccentOutput;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export type ImpromptuHistoryItem = {
  id: string;
  userId: string;
  topic: string;
  recordedAudioUrl?: string;
  rawTextResponse?: string; // New field for transcribed text
  analysisId?: string; // Link to the analysis history item
  createdAt: Timestamp;
};

export type AnalysisHistoryItem = {
  id: string;
  userId: string;
  userResponse: string;
  analysis: string;
  sentiment: string;
  keywords: string[];
  correctedText?: string;
  grammarAccuracy?: number;
  grammarMistakes?: { mistake: string; explanation: string; correction: string }[];
  pronunciation?: {
    overallAccuracy: number;
    detailedFeedback: { word: string; pronunciationAccuracy: number; errorDetails: string }[];
    suggestions: string;
    accentNotes?: string;
  };
  topicalityAdherence?: number;
  topicalityExplanation?: string;
  topicalityStrongPoints?: string[];
  topicalityMissedPoints?: string[];
  delivery?: {
    wordsPerMinute?: number;
    fillerWords?: string[];
    structureFeedback?: string;
    pacingFeedback?: string;
  };
  createdAt: Timestamp;
};

export type PitchPerfectHistoryItem = {
  id: string;
  userId: string;
  phrase: string;
  emotion: Emotion;
  recordedAudioUrl?: string;
  analysis?: AnalyzeToneOutput;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export type StorytellerHistoryItem = {
  id: string;
  userId: string;
  images: string[];
  recordedAudioUrl?: string;
  analysis?: AnalyzeStoryOutput;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};
