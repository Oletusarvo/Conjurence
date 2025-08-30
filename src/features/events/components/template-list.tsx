'use client';

import { List } from '@/components/feature/list-temp';
import { TEventData } from '../schemas/event-schema';
import Link from 'next/link';
import { ContainerLink } from '../../../components/ui/container-link';
import { Dice5, NotepadTextDashed } from 'lucide-react';
import { withAlternate } from '@/hoc/with-alternate';
import { useSearchProvider } from '@/providers/search-provider';

type TemplateListProps = {
  templates: Omit<
    TEventData & { id: string },
    'spots_available' | 'event_category_id' | 'is_template'
  >[];
};

export function TemplateList({ templates }: TemplateListProps) {
  const Component = withAlternate(List, true);
  const { order } = useSearchProvider();

  return (
    <Component
      showAlternate={templates.length == 0}
      alternate={<NoTemplates />}
      data={templates}
      sortFn={(a, b) => {
        return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }}
      component={({ item }) => (
        <ContainerLink
          href={`/app/event/create/new?template_id=${item.id}`}
          icon={Dice5}>
          <h3>{item.title}</h3>
          <p className='text-yellow-50'>{item.description}</p>
        </ContainerLink>
      )}
    />
  );
}

const NoTemplates = () => {
  return (
    <div className='flex flex-col flex-1 w-full items-center justify-center text-gray-400'>
      <Link
        href='/app/event/create/new'
        className='flex flex-col items-center gap-2'>
        <NotepadTextDashed size='3rem' />
        <span className='text-center'>No Templates Found!</span>
        <span>Tap here to create an event out of scratch.</span>
      </Link>
    </div>
  );
};
