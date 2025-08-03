import { AppFooter } from '@/components/AppFooter';
import { HighlightLink } from '@/components/HighlightLink';
import { Spinner } from '@/components/Spinner';
import { Plus, Search, User } from 'lucide-react';
import { Suspense } from 'react';

export default async function ApplicationLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <main className='flex flex-1 overflow-y-scroll max-h-full'>{children}</main>
      <AppFooter>
        <HighlightLink href='/app/feed'>
          <Search />
        </HighlightLink>

        <HighlightLink href='/app/event/create'>
          <Plus />
        </HighlightLink>
      </AppFooter>
    </>
  );
}
