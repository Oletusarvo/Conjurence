import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function cors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  console.log('Received request from origin', origin, 'Allowed: ', isAllowedOrigin);

  const isPreflight = req.method === 'OPTIONS';
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  if (isAllowedOrigin) {
    res.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    res.headers.set(key, value);
  });
}
