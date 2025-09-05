import db from '@/dbconfig';
import { eventService } from '@/features/events/services/event-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }) {
  try {
    const { event_id } = await params;
    if (!event_id) {
      return new NextResponse('Event id missing!', { status: 400 });
    }
    const event = await eventService.repo.findById(event_id, db);
    return new NextResponse(JSON.stringify(event), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
