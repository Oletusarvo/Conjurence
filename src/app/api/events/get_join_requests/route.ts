import { getAttendance } from '@/features/attendance/dal/getAttendance';
import db from '@/dbconfig';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.data) {
      return new NextResponse('Request body missing!', { status: 400 });
    }

    const { query } = body.data;
    if (!query) {
      return new NextResponse('Request query missing!', { status: 400 });
    }

    const joinRequests = await getAttendance(db).where(query);
    return new NextResponse(JSON.stringify(joinRequests), { status: 200 });
  } catch (err) {
    return new NextResponse(null, { status: 500 });
  }
}
