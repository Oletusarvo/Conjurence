'use client';

import { GeolocationMap } from '@/features/geolocation/components/geolocation-map';
import { useNearbyEvents } from '../hooks/use-nearby-events';
import { EventMarker } from '@/features/geolocation/components/event-marker';
import { EventProvider } from '../providers/event-provider';
import { Modal } from '@/components/modal-temp';
import { List } from '@/components/feature/list-temp';
import { TEvent } from '../schemas/event-schema';
import { ModalStackProvider } from '@/providers/modal-stack-provider';

export function EventMap() {
  const { events, cache, isPending } = useNearbyEvents();
  const src = events || cache;

  return (
    <ModalStackProvider>
      <GeolocationMap>
        <List<TEvent>
          data={src}
          component={({ item }) => {
            return (
              <EventProvider initialEvent={item}>
                <EventMarker />
              </EventProvider>
            );
          }}
        />
      </GeolocationMap>
    </ModalStackProvider>
  );
}
