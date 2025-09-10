import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useEventContext } from '../../events/providers/event-provider';
import { getDistanceInMeters } from '@/features/distance/util/get-distance-in-meters';
import { useEffect, useState } from 'react';
import { useStatus } from '@/hooks/use-status';
import { useEventPositionContext } from '@/features/events/providers/event-provider';

export function useDistance() {
  const [distance, setDistance] = useState(0);
  const [status, isPending, setStatus, resetStatus] = useStatus('loading');
  const { event } = useEventContext();
  const { position: eventPosition } = useEventPositionContext();
  const { position } = useGeolocationContext();
  const eventCoords = eventPosition?.coordinates as number[];

  useEffect(() => {
    if (position === null || !eventCoords) {
      return;
    }

    const d = getDistanceInMeters(position.coords, {
      latitude: eventCoords[1],
      longitude: eventCoords[0],
    } as GeolocationCoordinates);
    setDistance(Math.round(d));
    setStatus('idle');
  }, [position]);

  return { distance, isPending };
}
