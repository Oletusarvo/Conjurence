import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { getTimeLeft } from '@/features/events/util/getTimeLeft';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { event_id } = body.data;
    const event = await db(tablenames.event_instance).where({ id: event_id }).first();
    const timeLeft = getTimeLeft(event);
    return new NextResponse(timeLeft.toString(), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
