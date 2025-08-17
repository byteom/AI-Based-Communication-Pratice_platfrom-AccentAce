'use server';

/**
 * @fileOverview Analyzes a user's recorded speech and compares it to a reference phrase,
 * providing feedback on pronunciation accuracy.
 *
 * - analyzeAccent - A function that initiates the accent analysis process.
 * - AnalyzeAccentInput - The input type for the analyzeAccent function, including the recorded audio and reference text.
 * - AnalyzeAccentOutput - The return type for the analyzeAccent function, providing analysis results and feedback.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAccentInputSchema = z.object({
  recordedAudioDataUri: z
    .string()
    .describe(
      'The user recorded audio as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected description
    ),
  referenceText: z.string().describe('The original phrase for comparison.'),
});
export type AnalyzeAccentInput = z.infer<typeof AnalyzeAccentInputSchema>;

const AnalyzeAccentOutputSchema = z.object({
  overallAccuracy: z
    .number() 
    .min(0)
    .max(100)
    .describe('Overall accuracy score (0-100) of the user\'s pronunciation.'),
  detailedFeedback: z.array(
    z.object({
      word: z.string().describe('The word being analyzed.'),
      pronunciationAccuracy: z
        .number()
        .min(0)
        .max(100)
        .describe('Pronunciation accuracy score (0-100) for the word.'),
      errorDetails: z
        .string() 
        .describe('Specific feedback on pronunciation errors and suggestions.'),
    })
  ).describe('Detailed feedback for each word in the phrase.'),
  suggestions: z.string().describe('General suggestions for improving accent.'),
});
export type AnalyzeAccentOutput = z.infer<typeof AnalyzeAccentOutputSchema>;

export async function analyzeAccent(input: AnalyzeAccentInput): Promise<AnalyzeAccentOutput> {
  return analyzeAccentFlow(input);
}

const analyzeAccentPrompt = ai.definePrompt({
  name: 'analyzeAccentPrompt',
  input: {schema: AnalyzeAccentInputSchema},
  output: {schema: AnalyzeAccentOutputSchema},
  prompt: `You are an advanced AI-powered accent analysis tool. Your task is to analyze a user's recorded speech and provide detailed feedback on their pronunciation compared to a reference text.

  Analyze the user's pronunciation of each word in the context of the entire phrase. Provide specific feedback on pronunciation errors, phoneme inaccuracies, and areas for improvement. Also consider the linguistic correctness.

  Recorded Audio: {{media url=recordedAudioDataUri}}
  Reference Text: {{{referenceText}}}
  
  Output a detailed analysis including:
  - overallAccuracy: An overall accuracy score (0-100) of the user's pronunciation.
  - detailedFeedback: An array of objects, each containing:
    - word: The word being analyzed.
    - pronunciationAccuracy: A pronunciation accuracy score (0-100) for the word.
    - errorDetails: Specific feedback on pronunciation errors and suggestions.
  - suggestions: General suggestions for improving accent, rhythm, and intonation.
  
  Ensure the feedback is constructive and actionable, focusing on specific areas the user can improve to match the reference accent.`, // Adjusted prompt to be more specific
});

const analyzeAccentFlow = ai.defineFlow(
  {
    name: 'analyzeAccentFlow',
    inputSchema: AnalyzeAccentInputSchema,
    outputSchema: AnalyzeAccentOutputSchema,
  },
  async input => {
    const {output} = await analyzeAccentPrompt(input);
    return output!;
  }
);
