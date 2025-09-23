'use client';

import { List } from '@/components/feature/list-temp';
import { RoundButton } from '@/components/ui/round-button';
import { EventMarker } from '@/features/events/components/event-marker';
import { useNearbyEvents } from '@/features/events/hooks/use-nearby-events';
import { EventPositionListener } from '@/features/events/managers/event-position-listener';
import { EventProvider } from '@/features/events/providers/event-provider';
import { TEvent } from '@/features/events/schemas/event-schema';
import { GeolocationMap } from '@/features/geolocation/components/geolocation-map';
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
  const { events, refetch } = useNearbyEvents();

  const refreshFeed = () => {
    setLoading(true);
    const fn = debounce(async () => {
      await refetch();
      setLoading(false);
    }, 1500);

    fn();
  };

  const UpdateFeedButton = withLoader(RoundButton);
  return (
    <div className='w-full flex-1'>
      <ModalStackProvider>
        <GeolocationMap>
          <Markers
            events={events}
            onMarkerClicked={id => router.push(`/app/event/${id}`)}
          />
        </GeolocationMap>

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

function Markers({ events, onMarkerClicked }) {
  return (
    <List<TEvent>
      data={events}
      component={({ item }) => {
        return (
          <EventProvider initialEvent={item}>
            <EventPositionListener />
            <EventMarker onClick={() => onMarkerClicked(item.id)} />
          </EventProvider>
        );
      }}
    />
  );
}
