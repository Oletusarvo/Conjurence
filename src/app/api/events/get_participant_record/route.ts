import { getJoinRequest } from '@/features/attendance/dal/getAttendance';
import db from '@/dbconfig';
import { loadSession } from '@/util/loadSession';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await loadSession();
    const event_id = req.nextUrl.searchParams.get('event_id');
    const participantRecord = await getJoinRequest(db)
      .where({
        event_id,
        user_id: session.user_id,
      })
      .first();
    if (!participantRecord) {
      return new NextResponse('Record not found!', { status: 404 });
    }
    return new NextResponse(JSON.stringify(participantRecord), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
