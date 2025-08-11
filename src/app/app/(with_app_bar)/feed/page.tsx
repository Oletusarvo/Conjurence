import { getEvent } from '@/features/events/dal/getEvent';

import db from '@/dbconfig';
import { EventFeed } from '@/features/events/components/EventFeed';
import { SearchProvider } from '@/providers/SearchProvider';
import { tablenames } from '@/tablenames';
import { Pill } from '@/components/Pill';
import { capitalize } from '@/util/capitalize';

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
