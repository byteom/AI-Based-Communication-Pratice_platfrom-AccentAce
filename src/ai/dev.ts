import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-accent.ts';
import '@/ai/flows/generate-phrase.ts';
import '@/ai/flows/generate-audio.ts';
import '@/ai/flows/generate-scrambled-sentence.ts';
import '@/ai/flows/generate-impromptu-topic.ts';
import '@/ai/flows/generate-emotion-phrase.ts';
import '@/ai/flows/analyze-tone.ts';
import '@/ai/flows/generate-story-images.ts';
import '@/ai/flows/analyze-story.ts';
import '@/ai/flows/analyze-speech.ts';
import '@/ai/flows/analyze-response.ts';
