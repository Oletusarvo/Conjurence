'use client';

import { Armchair, Heading, MapPin, Text } from 'lucide-react';
import { Input } from '../../../components/Input';
import { withLoader } from '@/hoc/withLoader';
import { useCreateEventForm } from '../hooks/useCreateEventForm';
import { useRouter } from 'next/navigation';
import { TEventData } from '../schemas/eventSchema';
import { EventError } from '@/errors/events';
import { Notice } from '@/components/Notice';
import { useState } from 'react';
import { Sublabel } from '@/components/Sublabel';

type CreateEventForm = {
  categories: { id: string; label: string; description?: string }[];
  template?: TEventData;
};

export function CreateEventForm({ categories, template }: CreateEventForm) {
  const { submitEvent, isPending, status } = useCreateEventForm(template);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return categories.at(0)?.description || null;
  });

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
        icon={<Armchair />}
        name='spots_available'
        placeholder='Spots available...'
        type='number'
        defaultValue={template?.spots_available}
      />
      <div className='form-input-group'>
        <select
          name='event_category_id'
          defaultValue={template?.event_category_id}
          required>
          {categories.map((cat, i) => {
            return (
              <option
                onClick={() => setSelectedCategory(cat.description)}
                key={`cat-option-${i}`}
                value={cat.id}>
                {cat.label.at(0).toUpperCase() + cat.label.slice(1)}
              </option>
            );
          })}
        </select>
        {selectedCategory && <Sublabel>{selectedCategory || 'No description.'}</Sublabel>}
      </div>

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
          className='--outlined --secondary --full-width'
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
      {status === EventError.descriptionTooLong ? (
        <Notice variant='error'>The description is too long!</Notice>
      ) : status === EventError.maximumTemplateCount ? (
        <Notice variant='error'>
          You have reached your template quota! Please uncheck the save as template box.
        </Notice>
      ) : status === EventError.singleAttendance ? (
        <Notice variant='error'>Cannot create an event while hosting- or joined to another!</Notice>
      ) : status === EventError.titleTooLong ? (
        <Notice variant='error'>The title is too long!</Notice>
      ) : status === EventError.titleTooShort ? (
        <Notice variant='error'>The title is too short!</Notice>
      ) : status === EventError.locationTooLong ? (
        <Notice variant='error'>The location is too long!</Notice>
      ) : status === 'success' ? (
        <Notice variant='success'>
          Event created successfully! Redirecting to the event screen...
        </Notice>
      ) : status === 'error' ? (
        <Notice variant='error'>An unexpected error occured!</Notice>
      ) : status === EventError.locationDisabled ? (
        <Notice variant='error'>
          Geolocation is disabled! Please enable it to be able to create events.
        </Notice>
      ) : null}
    </form>
  );
}
