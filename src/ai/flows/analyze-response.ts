'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const analyzeResponseFlow = ai.defineFlow(
  {
    name: 'analyzeResponse',
    inputSchema: z.object({
      userResponse: z.string().describe('The user\'s text response to be analyzed.'),
    }),
    outputSchema: z.object({
      analysis: z.string().describe('The AI-generated analysis of the user\'s response.'),
      sentiment: z.string().describe('The sentiment of the user\'s response (e.g., positive, negative, neutral).'),
      keywords: z.array(z.string()).describe('Key keywords extracted from the user\'s response.'),
    }),
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'analyzeResponsePrompt',
      inputSchema: z.object({
        userResponse: z.string(),
      }),
      outputSchema: z.object({
        analysis: z.string(),
        sentiment: z.string(),
        keywords: z.array(z.string()),
      }),
      prompt: `You are an AI assistant designed to analyze user text responses.
Your task is to provide a comprehensive analysis of the given text, including:
- An overall analysis of the content.
- The sentiment of the response (positive, negative, or neutral).
- A list of key keywords.

User Response:
${input.userResponse}

Provide the analysis in a JSON format with the following keys:
"analysis": "Your comprehensive analysis here.",
"sentiment": "positive", "negative", or "neutral",
"keywords": ["keyword1", "keyword2", "keyword3"]
`,
    });

    const {output} = await prompt(input);
    return output;
  },
);

export type AnalyzeResponseInput = { userResponse: string };
export type AnalyzeResponseOutput = {
  analysis: string;
  sentiment: string;
  keywords: string[];
};

// Server action wrapper for client usage
export async function analyzeResponse(
  input: AnalyzeResponseInput,
): Promise<AnalyzeResponseOutput> {
  return analyzeResponseFlow(input);
}
