import { NextRequestWithAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export type MiddlewareStep = (
  req: NextRequest | NextRequestWithAuth,
  res: NextResponse
) => Promise<void | NextResponse>;
export async function withMiddlewareSteps(
  req: NextRequest | NextRequestWithAuth,
  steps: MiddlewareStep[]
) {
  const res = NextResponse.next();
  for (const step of steps) {
    const result = await step(req, res);
    if (result) {
      return result;
    }
  }
  return res;
}
