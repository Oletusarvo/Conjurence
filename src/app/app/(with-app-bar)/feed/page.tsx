'use client';

import { RoundButton } from '@/components/ui/round-button';
import { EventMap } from '@/features/events/components/event-map';
import { withLoader } from '@/hoc/with-loader';
import { ModalStackProvider } from '@/providers/modal-stack-provider';
import { debounce } from '@/util/network/debounce';
import { Plus, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EventFeedPage({ searchParams }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const refreshFeed = () => {
    setLoading(true);
    const fn = debounce(() => {
      router.refresh();
      setLoading(false);
    }, 1500);
    fn();
  };

  const UpdateFeedButton = withLoader(RoundButton);
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
          <UpdateFeedButton
            onClick={refreshFeed}
            loading={loading}
            disabled={loading}>
            <RotateCcw />
          </UpdateFeedButton>
        </div>
      </ModalStackProvider>
    </div>
  );
}
