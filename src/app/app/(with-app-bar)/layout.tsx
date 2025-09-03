import { AddEventButton } from '@/components/add-event-button';
import { AppFooter } from '@/components/app-footer';
import { HighlightLink } from '@/components/ui/highlight-link';
import { Search } from 'lucide-react';

export default async function ApplicationLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <main className='flex flex-col flex-1 gap-2 overflow-y-scroll justify-stretch'>
        {children}
      </main>
    </>
  );
}

function Footer() {
  return (
    <AppFooter>
      <HighlightLink href='/app/feed'>
        <button className='--ghost --round'>
          <Search />
        </button>
      </HighlightLink>
      <AddEventButton />
    </AppFooter>
  );
}
