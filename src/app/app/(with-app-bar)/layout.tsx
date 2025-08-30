import { AddEventButton } from '@/components/add-event-button';
import { AppFooter } from '@/components/app-footer';
import { HighlightLink } from '@/components/ui/highlight-link';
import { Search } from 'lucide-react';

export default async function ApplicationLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <main className='flex flex-col flex-1 px-default gap-2 py-2 overflow-y-scroll justify-stretch'>
        {children}
      </main>
      <AppFooter>
        <HighlightLink href='/app/feed'>
          <Search />
        </HighlightLink>
        <AddEventButton />
      </AppFooter>
    </>
  );
}
