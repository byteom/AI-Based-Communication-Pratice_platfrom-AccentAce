// This file holds the Genkit flow for generating practice phrases in a selected language and accent.

'use server';

/**
 * @fileOverview A practice phrase generation AI agent.
 *
 * - generatePhrase - A function that handles the practice phrase generation process.
 * - GeneratePhraseInput - The input type for the generatePhrase function.
 * - GeneratePhraseOutput - The return type for the generatePhrase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type { Difficulty } from '@/lib/accent-ace-config';

const GeneratePhraseInputSchema = z.object({
  language: z.string().describe('The language for the practice phrase.'),
  difficulty: z.custom<Difficulty>().describe('The difficulty level of the phrase.'),
  history: z.array(z.string()).optional().describe('A list of previously generated phrases to avoid repeating.'),
});
export type GeneratePhraseInput = z.infer<typeof GeneratePhraseInputSchema>;

const GeneratePhraseOutputSchema = z.object({
  phrase: z.string().describe('The generated practice phrase.'),
});
export type GeneratePhraseOutput = z.infer<typeof GeneratePhraseOutputSchema>;

export async function generatePhrase(input: GeneratePhraseInput): Promise<GeneratePhraseOutput> {
  return generatePhraseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePhrasePrompt',
  input: {schema: GeneratePhraseInputSchema},
  output: {schema: GeneratePhraseOutputSchema},
  prompt: `You are an AI that generates practice phrases for language learners.

  Generate a standard, common, and grammatically correct phrase in {{language}}.
  The phrase should be suitable for a {{difficulty}} difficulty level. 
  - Easy: 5-7 words, simple vocabulary.
  - Medium: 8-12 words, more complex sentence structure.
  - Hard: 13-15 words, advanced vocabulary and structure.

  The phrase should be no more than 15 words.

  {{#if history}}
  Please generate a new phrase that is different from these previous ones:
  {{#each history}}
  - {{{this}}}
  {{/each}}
  {{/if}}

  Return just the phrase itself. Do not include any regional dialect or slang.
  `,
});

const generatePhraseFlow = ai.defineFlow(
  {
    name: 'generatePhraseFlow',
    inputSchema: GeneratePhraseInputSchema,
    outputSchema: GeneratePhraseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
