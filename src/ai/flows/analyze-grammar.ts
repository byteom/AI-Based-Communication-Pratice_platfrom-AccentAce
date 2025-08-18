'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeGrammarInputSchema = z.object({
  transcript: z.string().describe("The user's spoken transcript to analyze for grammar."),
});
export type AnalyzeGrammarInput = z.infer<typeof AnalyzeGrammarInputSchema>;

const AnalyzeGrammarOutputSchema = z.object({
  correctedText: z.string().describe('A corrected version of the transcript.'),
  grammarAccuracy: z.number().min(0).max(100).describe('Estimated grammar correctness score (0-100).'),
  mistakes: z.array(
    z.object({
      mistake: z.string(),
      explanation: z.string(),
      correction: z.string(),
    })
  ).describe('List of grammar mistakes with explanations and corrections.'),
  improvementRoadmap: z.array(
    z.object({
      title: z.string(),
      steps: z.array(z.string()),
    })
  ).describe('A structured roadmap to improve grammar over time.'),
});
export type AnalyzeGrammarOutput = z.infer<typeof AnalyzeGrammarOutputSchema>;

export async function analyzeGrammar(
  input: AnalyzeGrammarInput,
): Promise<AnalyzeGrammarOutput> {
  return analyzeGrammarFlow(input);
}

const grammarPrompt = ai.definePrompt({
  name: 'analyzeGrammarPrompt',
  input: { schema: AnalyzeGrammarInputSchema },
  output: { schema: AnalyzeGrammarOutputSchema },
  prompt: `You are an expert English teacher and editor. Analyze the following transcript for grammar:

Transcript:
{{{transcript}}}

Provide:
- correctedText: a corrected version of the transcript (preserving the original meaning and style).
- grammarAccuracy: a score (0-100) representing overall grammar correctness.
- mistakes: A list of concrete grammar mistakes with a short explanation and a specific correction.
- improvementRoadmap: 2-3 themed sections with step-by-step guidance the user can follow over the next weeks.
`,
});

const analyzeGrammarFlow = ai.defineFlow(
  {
    name: 'analyzeGrammarFlow',
    inputSchema: AnalyzeGrammarInputSchema,
    outputSchema: AnalyzeGrammarOutputSchema,
  },
  async (input) => {
    const { output } = await grammarPrompt(input);
    return output!;
  },
);


