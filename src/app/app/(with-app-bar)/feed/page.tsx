import { getEvent } from '@/features/events/dal/get-event';

import db from '@/dbconfig';
import { EventFeed } from '@/features/events/components/event-feed';
import { SearchProvider } from '@/providers/search-provider';
import { tablenames } from '@/tablenames';
import { Pill } from '@/components/ui/pill-temp';
import { capitalize } from '@/util/capitalize';
import { EventFeedTabs } from '@/features/events/components/event-feed-tabs';

export const revalidate = 0;

export default async function EventFeedPage({ searchParams }: any) {
  const { q } = await searchParams;
  const getFeed = async () => {
    const data = await getEvent(db, {
      search: q,
      ignoreExpired: true,
    }).limit(50);

    return data;
  };

  //const feed = await getFeed();

  return (
    <SearchProvider>
      <EventFeed />
    </SearchProvider>
  );
}
