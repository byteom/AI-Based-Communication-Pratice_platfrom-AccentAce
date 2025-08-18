'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranscribeAudioInputSchema = z.object({
  recordedAudioDataUri: z
    .string()
    .describe(
      "The user's recorded audio as a data URI (e.g., data:audio/webm;base64,...)"
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcribed text of the provided audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export async function transcribeAudio(
  input: TranscribeAudioInput,
): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

const transcribePrompt = ai.definePrompt({
  name: 'transcribeAudioPrompt',
  input: { schema: TranscribeAudioInputSchema },
  output: { schema: TranscribeAudioOutputSchema },
  prompt: `You are an accurate speech transcription assistant.
Transcribe the following audio precisely, preserving punctuation and capitalization where appropriate.

Audio: {{media url=recordedAudioDataUri}}

Return only the transcript text in the 'transcript' field.
`,
});

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const { output } = await transcribePrompt(input);
    return output!;
  },
);


