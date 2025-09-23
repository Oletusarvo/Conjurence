import { RateLimiter } from '@/util/network/rate-limiter';
import { NextRequest, NextResponse } from 'next/server';

const limiterMap: Map<string, RateLimiter> = new Map();
limiterMap.set(
  '/register',
  new RateLimiter({
    requestLimit: 3,
    cooldownTime: 30000,
    ttl: 60000,
  })
);

limiterMap.set(
  '/app/event/create/new',
  new RateLimiter({
    requestLimit: 2,
    cooldownTime: 30000,
    ttl: 60000,
  })
);

export async function runRateLimiting(req: NextRequest, res: NextResponse) {
  const url = req.nextUrl;

  if (url.pathname === '/register' && req.method === 'POST') {
    //Limit registration attempts.
    const res = limiterMap.get(url.pathname)?.limit(req);
    if (res.status !== 200) {
      return res;
    }
  } else if (url.pathname === '/app/event/create/new' && req.method === 'POST') {
    //Limit event creation.
    const res = limiterMap.get(url.pathname)?.limit(req);
    if (res.status !== 200) {
      return res;
    }
  }
}
