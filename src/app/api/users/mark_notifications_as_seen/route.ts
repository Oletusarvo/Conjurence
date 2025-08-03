import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body) return new NextResponse('Body missing from request!', { status: 400 });

    const session = await loadSession();

    const notificationIdsToProcess = body.data;

    const currentNotifications = await db(tablenames.notification)
      //.whereIn('id', notificationIdsToProcess)
      .where({ user_id: session.user.id })
      .update({
        seen_at: new Date(),
      })
      .returning('*');

    //global.io.to(`user:${session.user.id}`).emit('new_notifications');
    return new NextResponse(JSON.stringify(currentNotifications), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
