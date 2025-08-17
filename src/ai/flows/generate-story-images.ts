
'use server';

/**
 * @fileOverview Generates a set of images to be used as a story prompt.
 *
 * - generateStoryImages - Creates three distinct images for storytelling.
 * - GenerateStoryImagesOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateStoryImagesOutputSchema = z.object({
  images: z.array(z.string().url()).length(3).describe('An array of three image URLs.'),
});
export type GenerateStoryImagesOutput = z.infer<typeof GenerateStoryImagesOutputSchema>;

export async function generateStoryImages(): Promise<GenerateStoryImagesOutput> {
  return generateStoryImagesFlow();
}

const generateStoryImagesFlow = ai.defineFlow(
  {
    name: 'generateStoryImagesFlow',
    outputSchema: GenerateStoryImagesOutputSchema,
  },
  async () => {
    const prompts = [
        "A mysterious, ancient key held in a gloved hand.",
        "A bustling, futuristic city street at night with flying vehicles.",
        "A serene, hidden waterfall in a lush, green forest."
    ];

    const imagePromises = prompts.map(prompt => 
        ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `cinematic, high detail, photorealistic image: ${prompt}`,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        })
    );
    
    const results = await Promise.all(imagePromises);
    const imageUrls = results.map(result => {
        if (!result.media) {
            throw new Error('Image generation failed for one of the prompts.');
        }
        return result.media.url;
    });

    return { images: imageUrls };
  }
);
