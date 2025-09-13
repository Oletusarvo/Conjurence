'use client';

import { EventCard } from '@/features/events/components/event-card';
import { PlusCircle } from 'lucide-react';
import { useSearchProvider } from '../../../providers/search-provider';
import Link from 'next/link';
import { TEvent } from '@/features/events/schemas/event-schema';
import { List } from '../../../components/feature/list-temp';
import { withAlternate } from '@/hoc/with-alternate';
import { EventProvider } from '../providers/event-provider';
import { DistanceProvider } from '@/features/distance/providers/distance-provider';
import { UserAttendanceManager } from '@/features/attendance/managers/user-attendance-manager';
import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner-temp';
import { useRef } from 'react';
import { useNearbyEvents } from '../hooks/use-nearby-events';
import { HostBadge } from './host-badge';
import { EventStatusBadge } from './ui/event-status-badge';

type EventFeedProps = {
  events: TEvent[];
};

/**Renders the main event-feed.
 * @todo Implement infinite scrolling.
 */
export function EventFeed() {
  const { order } = useSearchProvider();
  const { events, isPending } = useNearbyEvents();

  const EventList = withAlternate(List, true);
  return (
    <EventList
      showAlternate={events?.length === 0}
      alternate={<NoEvents />}
      data={events || []}
      sortFn={(a, b) => {
        const adate = new Date(a.created_at).getTime();
        const bdate = new Date(b.created_at).getTime();
        return order === 'asc' ? adate - bdate : bdate - adate;
      }}
      component={({ item }) => {
        return (
          <EventProvider initialEvent={item}>
            <DistanceProvider>
              <EventCard>
                <HostBadge />
                <EventStatusBadge />
              </EventCard>
            </DistanceProvider>
          </EventProvider>
        );
      }}
    />
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
