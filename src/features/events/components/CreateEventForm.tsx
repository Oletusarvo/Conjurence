'use client';

import { Armchair, Heading, MapPin, Text } from 'lucide-react';
import { Input } from '../../../components/Input';
import { withLoader } from '@/hoc/withLoader';
import { useCreateEventForm } from '../hooks/useCreateEventForm';
import { useRouter } from 'next/navigation';
import { TEventData } from '../schemas/eventSchema';

type CreateEventForm = {
  categories: { id: string; label: string }[];
  template?: TEventData;
};

export function CreateEventForm({ categories, template }: CreateEventForm) {
  const { submitEvent, isPending, status } = useCreateEventForm(template);
  const router = useRouter();

  const SubmitButton = withLoader(({ children, ...props }: React.ComponentProps<'button'>) => {
    return (
      <button
        {...props}
        className='--contained --accent --full-width'>
        {children}
      </button>
    );
  });

  return (
    <form
      className='flex flex-col gap-2 sm:w-[450px] xs:w-full'
      onSubmit={submitEvent}>
      <Input
        icon={<Heading />}
        name='title'
        placeholder='Title...'
        required
        defaultValue={template?.title}
      />
      <Input
        icon={<Text />}
        name='description'
        placeholder='Description...'
        required
        defaultValue={template?.description}
      />
      <Input
        icon={<MapPin />}
        name='location'
        placeholder='Location...'
        required
        defaultValue={template?.location}
      />

      <Input
        icon={<Armchair />}
        name='spots_available'
        placeholder='Spots available...'
        type='number'
        defaultValue={template?.spots_available}
      />

      <select
        name='event_category_id'
        defaultValue={template?.event_category_id}
        required>
        {categories.map((cat, i) => {
          return (
            <option
              key={`cat-option-${i}`}
              value={cat.id}>
              {cat.label}
            </option>
          );
        })}
      </select>

      <div className='flex gap-4 w-full justify-between'>
        <span>Save event as template?</span>
        <input
          type='checkbox'
          name='is_template'
          defaultChecked={template?.is_template}
        />
      </div>
      <div className='flex gap-2 w-full'>
        <button
          type='button'
          className='--outlined --accent --full-width'
          onClick={() => router.push('/app/feed')}>
          Cancel
        </button>
        <SubmitButton
          loading={isPending}
          disabled={isPending || status === 'success'}
          type='submit'>
          Submit
        </SubmitButton>
      </div>
    </form>
  );
}
