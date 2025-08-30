import db from '@/dbconfig';
import { getEvent } from '@/features/events/dal/get-event';
import { tablenames } from '@/tablenames';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const user_id = searchParams.get('user_id');
    if (!user_id) {
      return new NextResponse('User id missing from request!', { status: 400 });
    }

    const leftInstanceIds = await db({ ea: tablenames.event_attendance })
      .where({
        user_id,
        attendance_status_id: db
          .select('id')
          .from(tablenames.event_attendance_status)
          .where({ label: 'left' })
          .limit(1),
      })
      .select('event_instance_id')
      .pluck('event_instance_id');

    const events = await getEvent(db).whereIn('ei.id', leftInstanceIds);
    return new NextResponse(JSON.stringify(events), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
