import db from '@/dbconfig';
import { getAttendance } from '@/features/attendance/dal/getAttendance';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const eventId = req.nextUrl.searchParams.get('event_id');
    const attendees = await getAttendance(db)
      .where({ event_instance_id: eventId })
      .orderBy('requested_at', 'desc');
    return new NextResponse(JSON.stringify(attendees), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
