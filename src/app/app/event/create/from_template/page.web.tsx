import { RoundButton } from '@/components/ui/round-button';
import db from '@/dbconfig';
import { TemplateLinkList } from '@/features/events/components/template-list';
import { eventService } from '@/features/events/services/event-service';
import { eventTemplateService } from '@/features/events/services/event-template-service';
import { SearchProvider } from '@/providers/search-provider';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/load-session';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

export default async function EventTemplatesPage({ searchParams }) {
  const { q } = await searchParams;
  const session = await loadSession();
  const templates = await eventTemplateService.repo.findTemplatesByAuthorId(session.user.id, q, db);
  console.log(templates);
  return (
    <>
      <main className='flex flex-col gap-2 w-full py-2 px-default flex-1 overflow-y-scroll'>
        <SearchProvider>
          <TemplateLinkList templates={templates} />
        </SearchProvider>
      </main>
      <div className='w-full flex p-4 items-center justify-center gap-4'>
        <Link href='/app/event/create'>
          <RoundButton>
            <ArrowLeft />
          </RoundButton>
        </Link>
        <Link href={'/app/feed'}>
          <RoundButton>
            <X />
          </RoundButton>
        </Link>
      </div>
    </>
  );
}
