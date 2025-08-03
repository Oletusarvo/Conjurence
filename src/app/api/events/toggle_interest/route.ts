import db from '@/dbconfig';
import { getAttendance } from '@/features/attendance/dal/getAttendance';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await loadSession();
    const body = await req.json();
    const { eventId } = body.data;

    const currentParticipationRecord = await db(db.raw('?? AS p', [tablenames.event_attendance]))
      .join(
        db.raw('?? AS ps ON ps.id = p.attendance_status_id', [tablenames.event_attendance_status])
      )
      .where({ user_id: session.user.id, event_instance_id: eventId })
      .select('user_id', 'ps.label as status')
      .orderBy('requested_at')
      .first();

    if (currentParticipationRecord) {
      console.log(currentParticipationRecord);
      return new NextResponse('The user has already show interest in the event!', {
        status: 409,
      });
    }

    const statusRecord = await db(tablenames.event_attendance_status)
      .where({ label: 'interested' })
      .select('id')
      .first();

    await db(tablenames.event_attendance).insert({
      user_id: session.user.id,
      event_instance_id: eventId,
      attendance_status_id: statusRecord.id,
    });

    const interestCountRecord = await db(tablenames.event_attendance)
      .where({ event_instance_id: eventId })
      .count('* as count')
      .first();

    const newInterestRecord = await getAttendance(db)
      .where({ user_id: session.user.id, event_instance_id: eventId })
      .orderBy('requested_at', 'desc')
      .first();

    const room = `event:${eventId}`;
    global.io.to(room).emit('event:interest', {
      eventId,
      currentInterestCount: interestCountRecord.count,
      newInterestRecord,
    });

    return new NextResponse(JSON.stringify(newInterestRecord), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
