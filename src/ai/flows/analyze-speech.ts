'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSpeechInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe("Recorded user speech as a data URI (e.g., data:audio/webm;base64,...)"),
  topic: z.string().describe('The prompt/topic the user was asked to speak about.'),
});
export type AnalyzeSpeechInput = z.infer<typeof AnalyzeSpeechInputSchema>;

const AnalyzeSpeechOutputSchema = z.object({
  transcript: z.string().describe('Best-effort transcript derived from audio.'),
  grammar: z.object({
    correctedText: z.string(),
    accuracy: z.number().min(0).max(100),
    mistakes: z.array(z.object({
      mistake: z.string(),
      explanation: z.string(),
      correction: z.string(),
    })),
  }),
  pronunciation: z.object({
    overallAccuracy: z.number().min(0).max(100),
    detailedFeedback: z.array(z.object({
      word: z.string(),
      pronunciationAccuracy: z.number().min(0).max(100),
      errorDetails: z.string(),
    })),
    suggestions: z.string(),
    accentNotes: z.string().optional(),
  }),
  topicality: z.object({
    adherence: z.number().min(0).max(100).describe('How well the user stuck to the given topic.'),
    explanation: z.string(),
    missedPoints: z.array(z.string()).optional(),
    strongPoints: z.array(z.string()).optional(),
  }),
  delivery: z.object({
    wordsPerMinute: z.number().optional(),
    fillerWords: z.array(z.string()).optional(),
    structureFeedback: z.string().optional(),
    pacingFeedback: z.string().optional(),
  }),
  summary: z.string(),
  improvementRoadmap: z.array(z.object({
    title: z.string(),
    steps: z.array(z.string()),
  })),
});
export type AnalyzeSpeechOutput = z.infer<typeof AnalyzeSpeechOutputSchema>;

export async function analyzeSpeech(
  input: AnalyzeSpeechInput,
): Promise<AnalyzeSpeechOutput> {
  return analyzeSpeechFlow(input);
}

const analyzeSpeechPrompt = ai.definePrompt({
  name: 'analyzeSpeechPrompt',
  input: { schema: AnalyzeSpeechInputSchema },
  output: { schema: AnalyzeSpeechOutputSchema },
  prompt: `You are an expert speech coach.
Analyze the following spoken audio directly for pronunciation, accent, grammar, and topicality.
The user was given this topic: {{{topic}}}

Audio: {{media url=audioDataUri}}

Provide:
- transcript: a best-effort transcript of the speech.
- grammar: correctedText, accuracy (0-100), and concrete mistakes with explanation and correction.
- pronunciation: overallAccuracy (0-100), detailed word-level feedback with errors, suggestions, accent notes.
- topicality: adherence (0-100) to the topic with explanation, strongPoints, missedPoints.
- delivery: wordsPerMinute (estimate), fillerWords (list), structureFeedback, pacingFeedback.
- summary: a concise but insightful overall summary.
- improvementRoadmap: 2-3 sections, each with step-by-step actions.

Be precise and actionable. Return all fields fully populated.
`,
});

const analyzeSpeechFlow = ai.defineFlow(
  {
    name: 'analyzeSpeechFlow',
    inputSchema: AnalyzeSpeechInputSchema,
    outputSchema: AnalyzeSpeechOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeSpeechPrompt(input);
    return output!;
  },
);


