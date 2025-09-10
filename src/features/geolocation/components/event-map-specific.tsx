'use client';

import { useEventContext } from '@/features/events/providers/event-provider';
import { GeolocationMap } from './geolocation-map';
import { EventMarker } from './event-marker';
import { FlyToPosition } from './flyto-position';
import { useEventPositionContext } from '@/features/events/providers/event-provider';

/**Renders a GeolocationMap containing a single, specific event. */
export function EventMapSpecific() {
  const { position: eventPosition } = useEventPositionContext();
  const eventPositionCoords = eventPosition?.coordinates;
  const center = eventPositionCoords && {
    lat: eventPositionCoords.at(1),
    lng: eventPositionCoords.at(0),
  };

  return (
    <GeolocationMap
      center={center}
      dragging={false}
      zoom={13}
      minZoom={13}>
      <EventMarker />
      <FlyToPosition position={center} />
    </GeolocationMap>
  );
}
