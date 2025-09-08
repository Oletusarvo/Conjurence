import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useSearchProvider } from '@/providers/search-provider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';

export function useNearbyEvents() {
  const { position, distanceToPreviousPosition } = useGeolocationContext();
  const search = useSearchParams().get('q');
  const eventCache = useRef([]);

  const { data: events, isPending } = useQuery({
    queryKey: [`events`, position, search],
    queryFn: async () =>
      axios
        .get(
          `/api/events/get_nearby?lat=${position?.coords.latitude}&lng=${
            position?.coords.longitude
          }&q=${search || ''}`
        )
        .then(res => {
          eventCache.current = res.data;
          return res.data;
        }),

    enabled: !!position && distanceToPreviousPosition >= 1000, //Trigger only when 1km away from the previous position.
  });

  return { events, isPending, cache: eventCache.current };
}
