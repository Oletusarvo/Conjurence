'use client';
import { GeolocationMap } from '@/features/geolocation/components/geolocation-map';
import { EventMarker } from './event-marker';
import { FlyToPosition } from '@/features/geolocation/components/flyto-position';
import { useEventPositionContext } from '../providers/event-position-provider';

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
