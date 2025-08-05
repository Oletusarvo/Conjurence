'use client';

import { List } from '@/components/List';
import { TEventData } from '../schemas/eventSchema';
import Link from 'next/link';
import { ContainerLink } from '../../../components/ContainerLink';
import { Dice5, NotepadTextDashed } from 'lucide-react';
import { withAlternate } from '@/hoc/withAlternate';
import { SearchProvider } from '@/providers/SearchProvider';

type TemplateListProps = {
  templates: Omit<
    TEventData & { id: string },
    'spots_available' | 'event_category_id' | 'is_template'
  >[];
};

export function TemplateList({ templates }: TemplateListProps) {
  const Component = withAlternate(List, true);

  return (
    <Component
      showAlternate={templates.length == 0}
      alternate={<NoTemplates />}
      data={templates}
      component={({ item }) => (
        <ContainerLink
          href={'/app/event/create/from_template/' + item.id}
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
