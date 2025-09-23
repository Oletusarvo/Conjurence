import { NextRequestWithAuth } from 'next-auth/middleware';
import { withMiddlewareSteps } from './with-middleware-steps';
import { cors } from './middleware-steps/cors';
import { verifyToken } from './middleware-steps/verify-token';
import { runRateLimiting } from './middleware-steps/run-rate-limiting';

export default async function middleware(req: NextRequestWithAuth) {
  return await withMiddlewareSteps(req, [cors, verifyToken, runRateLimiting]);
}

export const config = {
  matcher: ['/', '/app/:path*', '/api/:path*'],
};
