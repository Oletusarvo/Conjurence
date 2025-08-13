import { useGeolocationContext } from '@/features/geolocation/providers/GeolocationProvider';
import { useEventContext } from '../../events/providers/EventProvider';
import { getDistanceInMeters } from '@/features/distance/util/getDistanceInMeters';
import { useEffect, useState } from 'react';
import { useStatus } from '@/hooks/useStatus';

export function useDistance() {
  const [distance, setDistance] = useState(0);
  const [status, isPending, setStatus, resetStatus] = useStatus('loading');
  const { event } = useEventContext();
  const { position } = useGeolocationContext();
  console.log(event);
  const eventCoords = event?.location.coordinates as number[];

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
