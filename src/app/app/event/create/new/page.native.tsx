'use client';

import { CreateEventForm } from '@/features/events/components/create-event-form/create-event-form';
import { FormContainer } from '@/components/form-temp';
import { EventTemplateProvider } from '@/features/events/providers/event-template-provider';
import { useUserContext } from '@/features/users/providers/user-provider';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { networkConfig } from '@/network.config';
import { Spinner } from '@/components/ui/spinner-temp';

export default async function ClientCreateEventPage() {
  const { user, sessionStatus } = useUserContext();
  const template_id = useSearchParams().get('template_id');

  const { data: templateRecord, isPending: isTemplatePending } = useQuery({
    queryKey: ['template', template_id],
    queryFn: async () => {
      const res = await axios.get(`${networkConfig.api}/templates/${template_id}`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch template!');
      }
      return res.data;
    },
  });

  const { data: categories, isPending: isCategoriesPending } = useQuery({
    queryKey: ['data-categories'],
    queryFn: async () => {
      const res = await axios.get(`${networkConfig.api}/data/event-categories`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch event categories!');
      }
      return res.data || [];
    },
  });

  const { data: sizes, isPending: isSizesPending } = useQuery({
    queryKey: ['data-sizes'],
    queryFn: async () => {
      const res = await axios.get(`${networkConfig.api}/data/event-sizes`);
      if (res.status !== 200) {
        throw new Error('Failed to fetch event sizes!');
      }
      return res.data || [];
    },
  });

  //Check that the template is by the logged in user.
  if (templateRecord && templateRecord.author_id !== user?.id) {
    return <span>Only the author of a template can use it!</span>;
  }

  const isPending = isCategoriesPending || isSizesPending || isTemplatePending;

  return isPending ? (
    <Spinner />
  ) : (
    <div className='flex flex-col w-full flex-1 items-center'>
      <FormContainer>
        <div className='px-default'>
          <h2>Create event</h2>
        </div>

        <EventTemplateProvider initialTemplate={templateRecord}>
          <CreateEventForm
            categories={categories}
            sizes={sizes}
          />
        </EventTemplateProvider>
      </FormContainer>
    </div>
  );
}
