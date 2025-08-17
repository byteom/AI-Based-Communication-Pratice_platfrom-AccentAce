
'use server';
/**
 * @fileOverview Generates a topic for an impromptu speech.
 *
 * - generateImpromptuTopic - Creates a random topic for a user to speak about.
 * - GenerateImpromptuTopicOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateImpromptuTopicOutputSchema = z.object({
  topic: z.string().describe('A random, engaging topic for an impromptu speech.'),
});

export type GenerateImpromptuTopicOutput = z.infer<typeof GenerateImpromptuTopicOutputSchema>;

export async function generateImpromptuTopic(): Promise<GenerateImpromptuTopicOutput> {
  return generateImpromptuTopicFlow();
}

const prompt = ai.definePrompt({
  name: 'generateImpromptuTopicPrompt',
  output: { schema: GenerateImpromptuTopicOutputSchema },
  prompt: `You are an AI for a public speaking practice app. 
    Generate a single, interesting, and SFW (safe for work) topic for an impromptu speech. 
    The topic should be a question or a statement that someone can talk about for a minute.
    
    Examples:
    - "What is a skill you'd like to learn and why?"
    - "Describe your favorite place in the world."
    - "If you could have any superpower, what would it be and how would you use it?"
    - "Talk about a book or movie that has had a big impact on you."
  `,
});


const generateImpromptuTopicFlow = ai.defineFlow(
  {
    name: 'generateImpromptuTopicFlow',
    outputSchema: GenerateImpromptuTopicOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
