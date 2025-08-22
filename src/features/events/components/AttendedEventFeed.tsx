'use client';

import { List } from '@/components/feature/List';
import { DistanceProvider } from '@/features/distance/providers/DistanceProvider';
import { withAlternate } from '@/hoc/withAlternate';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { EventProvider } from '../providers/EventProvider';
import { EventCard } from './EventCard';
import { Spinner } from '@/components/ui/Spinner';
import axios from 'axios';
import { useUserContext } from '@/features/users/providers/UserProvider';

export function AttendedEventFeed() {
  const search = useSearchParams().get('q');
  const { user } = useUserContext();
  const { data: events, isPending } = useQuery({
    queryKey: ['attended-events', search],
    queryFn: async () =>
      axios.get(`/api/events/attended?user_id=${user.id}&q=${search || ''}`).then(res => res.data),
  });

  const AttendedEventsList = withAlternate(List, true);

  return (
    <AttendedEventsList
      alternate={<Spinner />}
      showAlternate={isPending}
      data={events || []}
      component={({ item }) => {
        return (
          <EventProvider initialEvent={item}>
            <DistanceProvider>
              <EventCard />
            </DistanceProvider>
          </EventProvider>
        );
      }}
    />
  );
}
