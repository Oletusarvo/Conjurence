'use client';

import { List } from '@/components/List';
import { TEventData } from '../schemas/eventSchema';
import Link from 'next/link';
import { ContainerLink } from './ContainerLink';
import { Dice5 } from 'lucide-react';

type TemplateListProps = {
  templates: Omit<
    TEventData & { id: string },
    'spots_available' | 'event_category_id' | 'is_template'
  >[];
};

export function TemplateList({ templates }: TemplateListProps) {
  return (
    <List
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
