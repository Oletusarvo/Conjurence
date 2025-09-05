import db from '@/dbconfig';
import { TemplateLinkList } from '@/features/events/components/template-list';
import { eventService } from '@/features/events/services/event-service';
import { SearchProvider } from '@/providers/search-provider';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/load-session';

export default async function EventTemplatesPage({ searchParams }) {
  const { q } = await searchParams;
  const session = await loadSession();
  const templates = await eventService.repo.findTemplatesByAuthorId(session.user.id, null, db);
  return (
    <div className='flex flex-col gap-2 w-full py-2 px-default h-full'>
      <SearchProvider>
        <TemplateLinkList templates={templates} />
      </SearchProvider>
    </div>
  );
}
