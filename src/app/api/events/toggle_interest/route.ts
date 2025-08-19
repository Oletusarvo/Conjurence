import { toggleInterestAction } from '@/features/attendance/actions/createAttendanceAction';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await toggleInterestAction(body.data.eventId);
    if (res.success === true) {
      return new NextResponse(JSON.stringify(res.data), { status: 200 });
    } else {
      return new NextResponse(res.error, { status: 422 });
    }
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
