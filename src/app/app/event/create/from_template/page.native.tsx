'use client';

import { RoundButton } from '@/components/ui/round-button';
import { Spinner } from '@/components/ui/spinner-temp';
import db from '@/dbconfig';
import { TemplateLinkList } from '@/features/events/components/template-list';
import { eventService } from '@/features/events/services/event-service';
import { eventTemplateService } from '@/features/events/services/event-template-service';
import { useUserContext } from '@/features/users/providers/user-provider';
import { networkConfig } from '@/network.config';
import { SearchProvider } from '@/providers/search-provider';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/load-session';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default async function ClientEventTemplatesPage() {
  const q = useSearchParams().get('q');
  const { user, sessionStatus } = useUserContext();
  const { data: templates, isPending: templatesPending } = useQuery({
    queryKey: ['templates', user?.id],
    queryFn: async () => {
      const res = await axios.get(`${networkConfig.api}/events/templates?q=${q}`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch templates!');
      }
      return res.data || [];
    },
    enabled: sessionStatus === 'authenticated',
  });

  console.log(templates);
  return templatesPending ? (
    <Spinner />
  ) : (
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
