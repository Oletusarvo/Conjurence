import { EventFeed } from '@/features/events/components/event-feed';
import { SearchProvider } from '@/providers/search-provider';

export const revalidate = 0;

export default async function EventFeedPage({ searchParams }: any) {
  return (
    <SearchProvider>
      <EventFeed />
    </SearchProvider>
  );
}
