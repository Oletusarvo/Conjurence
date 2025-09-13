import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';

export function useNearbyEvents() {
  const { position } = useGeolocationContext();
  const search = useSearchParams().get('q');

  const { data: events, isPending } = useQuery({
    placeholderData: prev => prev,
    queryKey: [`events`, search],
    queryFn: async () => {
      return axios
        .get(
          `/api/events/get_nearby?lat=${position?.coords.latitude}&lng=${
            position?.coords.longitude
          }&q=${search || ''}`
        )
        .then(res => {
          return res.data;
        });
    },
  });

  return { events, isPending };
}
