import { AddEventButton } from '@/components/AddEventButton';
import { AppFooter } from '@/components/AppFooter';
import { HighlightLink } from '@/components/ui/HighlightLink';
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
