import db from '@/dbconfig';
import { getAttendance } from '@/features/attendance/dal/getAttendance';
import { loadSession } from '@/util/loadSession';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const eventId = req.nextUrl.searchParams.get('event_id');
    const session = await loadSession();

    const attendanceRecord = await getAttendance(db)
      .where({ event_instance_id: eventId, user_id: session.user.id })
      .orderBy('requested_at', 'desc')
      .first();

    return new NextResponse(JSON.stringify(attendanceRecord), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
