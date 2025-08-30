'use client';

import { TabButton } from '@/components/ui/tab-button';
import { TabsProvider } from '@/providers/tabs-provider';
import { EventFeed } from './event-feed';
import { AttendedEventFeed } from './attended-event-feed';

export function EventFeedTabs() {
  return (
    <TabsProvider>
      <div className='flex w-full'>
        <TabsProvider.Trigger tabIndex={0}>
          <TabButton>List</TabButton>
        </TabsProvider.Trigger>

        <TabsProvider.Trigger tabIndex={1}>
          <TabButton>Map</TabButton>
        </TabsProvider.Trigger>
      </div>

      <TabsProvider.Tab tabIndex={0}>
        <EventFeed />
      </TabsProvider.Tab>

      <TabsProvider.Tab tabIndex={1}></TabsProvider.Tab>
    </TabsProvider>
  );
}
