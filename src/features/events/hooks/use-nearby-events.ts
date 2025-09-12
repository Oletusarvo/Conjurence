import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';

export function useNearbyEvents() {
  const { position } = useGeolocationContext();
  const search = useSearchParams().get('q');
  const eventCache = useRef([]);

  const { data: events, isPending } = useQuery({
    queryKey: [`events`, search],
    queryFn: async () => {
      return axios
        .get(
          `/api/events/get_nearby?lat=${position?.coords.latitude}&lng=${
            position?.coords.longitude
          }&q=${search || ''}`
        )
        .then(res => {
          eventCache.current = res.data;
          return res.data;
        });
    },
  });

  return { events, isPending, cache: eventCache.current };
}
