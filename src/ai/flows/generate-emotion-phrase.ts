
'use server';
/**
 * @fileOverview Generates a phrase suitable for practicing emotional tone.
 *
 * - generateEmotionPhrase - Creates a phrase for a given emotion.
 * - GenerateEmotionPhraseInput - The input type for the flow.
 * - GenerateEmotionPhraseOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Emotion } from '@/lib/accent-ace-config';

const GenerateEmotionPhraseInputSchema = z.object({
  emotion: z.custom<Emotion>().describe('The target emotion for the phrase.'),
});
export type GenerateEmotionPhraseInput = z.infer<typeof GenerateEmotionPhraseInputSchema>;

const GenerateEmotionPhraseOutputSchema = z.object({
  phrase: z.string().describe('A sentence that is commonly said with the specified emotion.'),
});
export type GenerateEmotionPhraseOutput = z.infer<typeof GenerateEmotionPhraseOutputSchema>;

export async function generateEmotionPhrase(input: GenerateEmotionPhraseInput): Promise<GenerateEmotionPhraseOutput> {
  return generateEmotionPhraseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmotionPhrasePrompt',
  input: { schema: GenerateEmotionPhraseInputSchema },
  output: { schema: GenerateEmotionPhraseOutputSchema },
  prompt: `You are an AI for a speech coaching app. 
    Generate a single, common, SFW (safe for work) English sentence that someone would realistically say with a "{{emotion}}" tone.
    The sentence should be between 7 and 15 words long.
    
    Return just the sentence itself.
  `,
});


const generateEmotionPhraseFlow = ai.defineFlow(
  {
    name: 'generateEmotionPhraseFlow',
    inputSchema: GenerateEmotionPhraseInputSchema,
    outputSchema: GenerateEmotionPhraseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
