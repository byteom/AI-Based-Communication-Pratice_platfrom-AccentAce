import handleRequest from '@genkit-ai/next';

import '@/ai/dev';

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}
