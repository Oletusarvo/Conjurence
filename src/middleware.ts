import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { RateLimiter } from './util/network/rateLimiter';

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
      if (url.pathname !== anchoredUrl) {
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
    if (url.pathname.startsWith('/app')) {
      const newUrl = url.clone();
      newUrl.pathname = '/login';
      newUrl.searchParams.set('callback_url', url.toString());
      return NextResponse.redirect(newUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*'],
};
