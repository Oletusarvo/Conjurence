'use client';

import { List } from '@/components/feature/list-temp';
import Link from 'next/link';
import { ContainerLink } from '../../../components/ui/container-link';
import { Dice5, NotepadTextDashed } from 'lucide-react';
import { withAlternate } from '@/hoc/with-alternate';
import { useSearchProvider } from '@/providers/search-provider';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { TEvent } from '../schemas/event-schema';
import { EventProvider } from '../providers/event-provider';
import { EventCard } from './event-card';
import { HostBadge } from './host-badge';
import { EventStatusBadge } from './ui/event-status-badge';

type TemplateListProps = {
  templates?: Omit<TEvent, 'spots_available' | 'event_category_id' | 'is_template'>[];
  component: ({ item }) => ReactNode;
  onNewEvent?: () => void;
};

export function TemplateList({
  templates = [],
  component: Component,
  onNewEvent,
}: TemplateListProps) {
  const ListComponent = withAlternate(List, true);
  const { order } = useSearchProvider();

  return (
    <ListComponent
      showAlternate={templates?.length === 0}
      alternate={<NoTemplates onNewEvent={onNewEvent} />}
      data={templates}
      sortFn={(a, b) => {
        return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }}
      component={Component}
    />
  );
}

/**A prefab TemplateList rendering templates as ContainerLinks. */
export function TemplateLinkList({ templates }: { templates: TemplateListProps['templates'] }) {
  return (
    <TemplateList
      templates={templates}
      component={({ item }) => {
        return (
          <Link href={`/app/event/create/new?template_id=${item.id}`}>
            <EventProvider initialEvent={item}>
              <EventCard>
                <HostBadge />
              </EventCard>
            </EventProvider>
          </Link>
        );
      }}
    />
  );
}

/**<ContainerLink
            href={`/app/event/create/new?template_id=${item.id}`}
            icon={Dice5}>
            <h3>{item.title}</h3>
            <p className='text-yellow-50'>{item.description}</p>
          </ContainerLink> */

const NoTemplates = ({ onNewEvent = null }) => {
  const router = useRouter();
  return (
    <div className='flex flex-col flex-1 w-full items-center justify-center text-gray-400'>
      <div
        className='flex flex-col items-center gap-2'
        onClick={() => {
          if (onNewEvent) {
            onNewEvent();
          } else {
            router.push('/app/event/create/new');
          }
        }}>
        <NotepadTextDashed size='3rem' />
        <span className='text-center'>No Templates Found!</span>
        <span>Tap here to create an event out of scratch.</span>
      </div>
    </div>
  );
};
