'use client';

import { GeolocationMap } from '@/features/geolocation/components/geolocation-map';
import { useNearbyEvents } from '../hooks/use-nearby-events';
import { EventMarker } from '@/features/geolocation/components/event-marker';
import { EventProvider } from '../providers/event-provider';
import { List } from '@/components/feature/list-temp';
import { TEvent } from '../schemas/event-schema';
import { EventPositionListener } from '../managers/event-position-listener';
import { useRouter } from 'next/navigation';

/**Renders nearby events as markers on a leaflet-map. Must be placed within the scope of a ModalStackProvider*/
export function EventMap() {
  return (
    <GeolocationMap>
      {/**Fetch the events and render the markers in another component, to stop the map from re-rendering unecessarily. */}
      <Markers />
    </GeolocationMap>
  );
}

function Markers() {
  const { events, isPending } = useNearbyEvents();
  const router = useRouter();

  return (
    <List<TEvent>
      data={events || []}
      component={({ item }) => {
        return (
          <EventProvider initialEvent={item}>
            <EventPositionListener />
            <EventMarker onClick={() => router.push(`/app/event/${item.id}`)} />
          </EventProvider>
        );
      }}
    />
  );
}
