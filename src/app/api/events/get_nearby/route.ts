import db from '@/dbconfig';
import { getEvent } from '@/features/events/dal/get-event';
import { eventService } from '@/features/events/services/event-service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @todo
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q');
    const lng = req.nextUrl.searchParams.get('lng');
    const lat = req.nextUrl.searchParams.get('lat');
    const latitude = typeof lat === 'string' ? parseFloat(lat) : 0;
    const longitude = typeof lng === 'string' ? parseFloat(lng) : 0;
    const events = await eventService.repo.findWithinDistanceByCoordinates(
      longitude,
      latitude,
      10000,
      db,
      q
    );

    return new NextResponse(JSON.stringify(events), { status: 200 });
  } catch (err: any) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
