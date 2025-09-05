'use client';

import { withIcon } from '@/hoc/with-icon';
import { SearchProvider } from '@/providers/search-provider';
import { Dice5 } from 'lucide-react';
import { TemplateList } from '../template-list';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function SelectTemplateStep({ onTemplateSelected, onNewEvent }) {
  const { data: templates, isPending } = useQuery({
    queryKey: ['event-templates'],
    queryFn: async () => await axios.get('/api/events/templates').then(res => res.data),
  });

  return (
    <SearchProvider>
      <div className='flex flex-col gap-2 max-h-full overflow-y-scroll'>
        <TemplateList
          templates={templates}
          component={({ item }) => {
            const Button = withIcon(({ children, ...props }) => (
              <button
                {...props}
                className='--contained --accent'>
                {children}
              </button>
            ));
            return (
              <Button
                icon={<Dice5 />}
                onClick={() => onTemplateSelected(item)}>
                {item.title}
              </Button>
            );
          }}
          onNewEvent={onNewEvent}
        />
      </div>
    </SearchProvider>
  );
}
