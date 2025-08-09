import { useGeolocationContext } from '@/features/geolocation/providers/GeolocationProvider';
import { useEventContext } from '../../events/providers/EventProvider';
import { getDistanceInMeters } from '@/util/geolocation/getDistanceInMeters';
import { useEffect, useState } from 'react';
import { useStatus } from '@/hooks/useStatus';

export function useDistance() {
  const [distance, setDistance] = useState(0);
  const [status, isPending, setStatus, resetStatus] = useStatus('loading');
  const { event } = useEventContext();
  const { position } = useGeolocationContext();
  const eventCoords = event?.location.coords;
  useEffect(() => {
    if (position === null || !eventCoords) {
      return;
    }

    const d = getDistanceInMeters(position.coords, eventCoords);
    setDistance(Math.round(d));
    setStatus('idle');
  }, [position]);

  return { distance, isPending };
}
