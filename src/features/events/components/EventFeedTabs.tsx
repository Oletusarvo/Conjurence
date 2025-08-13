'use client';

import { Tab } from '@/components/Tab';
import { TabsProvider } from '@/providers/TabsProvider';
import { EventFeed } from './EventFeed';
import { AttendedEventFeed } from './AttendedEventFeed';

export function EventFeedTabs() {
  return (
    <TabsProvider>
      <div className='flex w-full'>
        <TabsProvider.Trigger tabIndex={0}>
          <Tab>Nearby</Tab>
        </TabsProvider.Trigger>

        <TabsProvider.Trigger tabIndex={1}>
          <Tab>Attended</Tab>
        </TabsProvider.Trigger>
      </div>

      <TabsProvider.Tab tabIndex={0}>
        <EventFeed />
      </TabsProvider.Tab>

      <TabsProvider.Tab tabIndex={1}>
        <AttendedEventFeed />
      </TabsProvider.Tab>
    </TabsProvider>
  );
}
