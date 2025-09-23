import db from '@/dbconfig';
import { eventTemplateService } from '@/features/events/services/event-template-service';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/load-session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }) {
  try {
    const session = await loadSession();
    const { template_id } = await params;
    //TODO: Verify the session user is the author of the template.
    const [authorId] = await db(tablenames.event_template)
      .where({ id: template_id })
      .select('author_id')
      .pluck('author_id');
    if (authorId !== session.user.id) {
      return new NextResponse('Only the author of a template can use it!', { status: 403 });
    }

    const template = await eventTemplateService.findTemplateById(template_id, db);
    return new NextResponse(JSON.stringify(template), { status: 200 });
  } catch (err: any) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
