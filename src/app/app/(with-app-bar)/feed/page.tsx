import { ConfirmDialog } from '@/components/feature/confirm-dialog';
import { TestModalButton } from '@/components/test-modal-button';
import { AddButton, RoundButton } from '@/components/ui/round-button';
import { EventFeed } from '@/features/events/components/event-feed';
import { EventMap } from '@/features/events/components/event-map';
import { SearchProvider } from '@/providers/search-provider';
import { ToggleProvider } from '@/providers/toggle-provider';
import Link from 'next/link';

export const revalidate = 0;

export default async function EventFeedPage({ searchParams }: any) {
  return (
    <div className='w-full flex-1'>
      <EventMap />
      <div className='absolute bottom-0 right-0 z-90 flex w-full items-center gap-4 justify-end px-4 py-4'>
        <Link href='/app/event/create'>
          <AddButton />
        </Link>
      </div>
    </div>
  );
}
