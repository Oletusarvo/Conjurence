import db from '@/dbconfig';
import { getEvent } from '@/features/events/dal/get-event';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }) {
  try {
    const { event_id } = await params;
    if (!event_id) {
      return new NextResponse('Event id missing!', { status: 400 });
    }
    const event = await getEvent(db).where({ 'ei.id': event_id }).first();
    return new NextResponse(JSON.stringify(event), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
