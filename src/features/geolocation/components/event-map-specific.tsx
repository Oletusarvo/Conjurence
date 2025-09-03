'use client';

import { useEventContext } from '@/features/events/providers/event-provider';
import { GeolocationMap } from './geolocation-map';
import { EventMarker } from './event-marker';

/**Renders a GeolocationMap containing a single, specific event. */
export function EventMapSpecific() {
  return (
    <GeolocationMap>
      <EventMarker />
    </GeolocationMap>
  );
}
