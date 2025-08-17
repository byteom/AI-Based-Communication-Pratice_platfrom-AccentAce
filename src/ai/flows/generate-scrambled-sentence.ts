
'use server';
/**
 * @fileOverview Generates a scrambled (jumbled) sentence for a game.
 *
 * - generateScrambledSentence - Creates a jumbled sentence and returns it along with the original.
 * - GenerateScrambledSentenceOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateScrambledSentenceOutputSchema = z.object({
  original: z.string().describe('The original, correct sentence.'),
  jumbled: z.string().describe('The jumbled version of the sentence.'),
});
export type GenerateScrambledSentenceOutput = z.infer<typeof GenerateScrambledSentenceOutputSchema>;

export async function generateScrambledSentence(): Promise<GenerateScrambledSentenceOutput> {
  return generateScrambledSentenceFlow();
}

const prompt = ai.definePrompt({
  name: 'generateScrambledSentencePrompt',
  output: { schema: GenerateScrambledSentenceOutputSchema },
  prompt: `You are an AI for a language learning game.
    Generate a common English sentence that is between 7 and 12 words long.
    Then, jumble the words of that sentence.
    Return both the original sentence and the jumbled sentence.
    For example:
    Original: "The quick brown fox jumps over the lazy dog."
    Jumbled: "lazy the over fox brown jumps dog The quick."
    `,
});

const generateScrambledSentenceFlow = ai.defineFlow(
  {
    name: 'generateScrambledSentenceFlow',
    outputSchema: GenerateScrambledSentenceOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
