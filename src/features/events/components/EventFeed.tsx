'use client';

import { EventCard } from '@/features/events/components/EventCard';
import { PlusCircle } from 'lucide-react';
import { useSearchProvider } from '../../../providers/SearchProvider';
import Link from 'next/link';
import { TEvent } from '@/features/events/schemas/eventSchema';
import { List } from '../../../components/feature/List';
import { withAlternate } from '@/hoc/withAlternate';
import { EventProvider } from '../providers/EventProvider';
import { DistanceProvider } from '@/features/distance/providers/DistanceProvider';
import { UserAttendanceManager } from '@/features/attendance/managers/UserAttendanceManager';
import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useGeolocationContext } from '@/features/geolocation/providers/GeolocationProvider';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Spinner } from '@/components/ui/Spinner';
import { useRef } from 'react';

type EventFeedProps = {
  events: TEvent[];
};

/**Renders the main event-feed.
 * @todo Implement infinite scrolling.
 */
export function EventFeed() {
  const { order } = useSearchProvider();
  const { position } = useGeolocationContext();
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

    enabled: !!position,
  });

  const EventList = withAlternate(List, true);
  return (
    <>
      <EventList
        showAlternate={events?.length === 0}
        alternate={<NoEvents />}
        data={events || eventCache.current}
        sortFn={(a, b) => {
          const adate = new Date(a.created_at).getTime();
          const bdate = new Date(b.created_at).getTime();
          return order === 'asc' ? adate - bdate : bdate - adate;
        }}
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
    </>
  );
}

function NoEvents() {
  return (
    <div className='flex flex-col flex-1 w-full items-center justify-center text-gray-400'>
      <Link
        href='/app/event/create'
        className='flex flex-col items-center gap-2'>
        <PlusCircle size='3rem' />
        <span className='text-center'>
          No Events. <br />
          Tap here to start one!
        </span>
      </Link>
    </div>
  );
}

function EventsLoading() {
  return (
    <div className='flex flex-col flex-1 w-full items-center justify-center text-gray-400'>
      <h2>Loading Events</h2>
      <Spinner />
    </div>
  );
}
