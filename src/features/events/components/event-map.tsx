'use client';

import { GeolocationMap } from '@/features/geolocation/components/geolocation-map';
import { useNearbyEvents } from '../hooks/use-nearby-events';
import { EventMarker } from '@/features/geolocation/components/event-marker';
import { EventProvider } from '../providers/event-provider';
import { List } from '@/components/feature/list-temp';
import { TEvent } from '../schemas/event-schema';
import { EventPositionListener } from '../managers/event-position-listener';
import { useRouter } from 'next/navigation';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { EventPositionProvider } from '../providers/event-position-provider';

/**Renders nearby events as markers on a leaflet-map. Must be placed within the scope of a ModalStackProvider*/
export function EventMap() {
  const { position } = useGeolocationContext();
  const { events, cache, isPending } = useNearbyEvents();
  const router = useRouter();
  const src = events || cache;

  const center = position
    ? { lng: position.coords.longitude, lat: position.coords.latitude }
    : null;
  return (
    <GeolocationMap
      center={center}
      onSelectLocation={coords => {
        console.log(coords);
      }}>
      <List<TEvent>
        data={src}
        component={({ item }) => {
          return (
            <EventProvider initialEvent={item}>
              <EventPositionProvider>
                <EventPositionListener />
                <EventMarker onClick={() => router.push(`/app/event/${item.id}`)} />
              </EventPositionProvider>
            </EventProvider>
          );
        }}
      />
    </GeolocationMap>
  );
}
