import { RoundButton } from '@/components/ui/round-button';
import { EventMap } from '@/features/events/components/event-map';
import { ModalStackProvider } from '@/providers/modal-stack-provider';
import { Plus } from 'lucide-react';
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
