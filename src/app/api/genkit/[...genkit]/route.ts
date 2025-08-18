import handleRequest from '@genkit-ai/next';

import '@/ai/dev';

export const runtime = 'edge';

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}
