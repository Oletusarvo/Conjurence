import { AddEventButton } from '@/components/add-event-button';
import { ConfirmDialog } from '@/components/feature/confirm-dialog';
import { TestModalButton } from '@/components/test-modal-button';
import { AddButton, RoundButton } from '@/components/ui/round-button';
import { AddEventModalTrigger } from '@/features/events/components/create-event-modal/create-event-modal-trigger';
import { EventFeed } from '@/features/events/components/event-feed';
import { EventMap } from '@/features/events/components/event-map';
import { ModalStackProvider } from '@/providers/modal-stack-provider';
import { SearchProvider } from '@/providers/search-provider';
import { ToggleProvider } from '@/providers/toggle-provider';
import { Map, Pin, Plus, User } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function EventFeedPage({ searchParams }: any) {
  return (
    <div className='w-full flex-1'>
      <ModalStackProvider>
        <EventMap />

        <div className='absolute bottom-0 right-0 z-10 flex w-full items-center gap-4 justify-center px-4 py-4'>
          <Link href='/app/event/create'>
            <RoundButton>
              <Plus />
            </RoundButton>
          </Link>
        </div>
      </ModalStackProvider>
    </div>
  );
}
