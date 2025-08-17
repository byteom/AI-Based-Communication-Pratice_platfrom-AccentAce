
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
  createdAt: Timestamp | string; 
  updatedAt?: Timestamp | string;
};

export type SentenceScrambleHistoryItem = {
  id: string;
  userId: string;
  scrambledSentence: string;
  correctSentence: string;
  scrambledAudioUrl: string;
  recordedAudioUrl?: string;
  analysis?: AnalyzeAccentOutput;
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export type ImpromptuHistoryItem = {
  id: string;
  userId: string;
  topic: string;
  recordedAudioUrl?: string;
  createdAt: Timestamp | string; 
  updatedAt?: Timestamp | string;
}

export type PitchPerfectHistoryItem = {
  id: string;
  userId: string;
  phrase: string;
  emotion: Emotion;
  recordedAudioUrl?: string;
  analysis?: AnalyzeToneOutput;
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
};

export type StorytellerHistoryItem = {
  id: string;
  userId: string;
  images: string[];
  recordedAudioUrl?: string;
  analysis?: AnalyzeStoryOutput;
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
};
