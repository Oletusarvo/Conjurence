import db from '@/dbconfig';
import { eventService } from '@/features/events/services/event-service';
import { eventTemplateService } from '@/features/events/services/event-template-service';
import { loadSession } from '@/util/load-session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await loadSession();
    const searchParams = req.nextUrl.searchParams;
    const templates = await eventTemplateService.repo.findTemplatesByAuthorId(
      session.user.id,
      searchParams.get('q'),
      db
    );
    return new NextResponse(JSON.stringify(templates), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
