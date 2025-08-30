import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { RateLimiter } from './util/network/rate-limiter';

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

export default async function middleware(req: NextRequestWithAuth) {
  const token = (await getToken({ req })) as {
    attended_event_id: string;
    exp: string;
  };
  const url = req.nextUrl;

  if (token) {
    //Check for token expiry and redirect to login.
    const exp = parseInt(token.exp) * 1000; //Seconds converted to milliseconds.
    const now = Date.now();
    if (Date.now() >= exp) {
      console.warn('Token has expired!', now, exp);
      const newUrl = url.clone();
      newUrl.pathname = '/login';
      return NextResponse.redirect(newUrl);
    }

    if (token.attended_event_id) {
      const anchoredUrl = `/app/event/${token.attended_event_id}`;
      //Only allow users to view the bios of other users, or the event they are attending.
      if (!url.pathname.startsWith('/app/user/') && url.pathname !== anchoredUrl) {
        const newUrl = url.clone();
        newUrl.pathname = anchoredUrl;
        return NextResponse.redirect(newUrl);
      }
    } else if (
      url.pathname === '/' ||
      url.pathname.includes('/login') ||
      url.pathname.includes('/register') ||
      url.pathname === '/app'
    ) {
      //Redirect to the /app/feed page if logged in.
      const newUrl = url.clone();
      newUrl.pathname = '/app/feed';
      return NextResponse.redirect(newUrl);
    }
  } else {
    //Redirect to login if not authenticated.
    if (url.pathname.startsWith('/app')) {
      const newUrl = url.clone();
      newUrl.pathname = '/login';
      newUrl.searchParams.set('callback_url', url.toString());
      return NextResponse.redirect(newUrl);
    }
  }

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*'],
};
