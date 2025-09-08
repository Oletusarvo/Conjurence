'use client';

import { useEventContext } from '@/features/events/providers/event-provider';
import { GeolocationMap } from './geolocation-map';
import { EventMarker } from './event-marker';
import { FlyToPosition } from './flyto-position';

/**Renders a GeolocationMap containing a single, specific event. */
export function EventMapSpecific() {
  const { event } = useEventContext();
  const eventPositionCoords = event?.position.coordinates;
  return (
    <GeolocationMap
      center={{ lat: eventPositionCoords.at(1), lng: eventPositionCoords.at(0) }}
      dragging={false}
      zoom={13}
      minZoom={13}>
      <EventMarker />
      <FlyToPosition
        position={{ lat: eventPositionCoords.at(1), lng: eventPositionCoords.at(0) }}
      />
    </GeolocationMap>
  );
}
