'use client';

import { List } from '@/components/feature/list-temp';
import { DistanceProvider } from '@/features/distance/providers/distance-provider';
import { withAlternate } from '@/hoc/with-alternate';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { EventProvider } from '../providers/event-provider';
import { EventCard } from './event-card';
import { Spinner } from '@/components/ui/spinner-temp';
import axios from 'axios';
import { useUserContext } from '@/features/users/providers/user-provider';

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
