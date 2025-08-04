import { toggleInterestAction } from '@/features/attendance/actions/toggleInterestAction';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newInterestRecord = await toggleInterestAction(body.data.eventId);
    return new NextResponse(JSON.stringify(newInterestRecord), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
