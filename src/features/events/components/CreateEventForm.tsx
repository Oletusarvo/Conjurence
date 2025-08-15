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
import { capitalize } from '@/util/capitalize';
import { List } from '@/components/List';

type CreateEventForm = {
  categories: { id: string; label: string; description?: string }[];
  thresholds: { id: number; label: string; description: string }[];
  template?: TEventData;
};

export function CreateEventForm({ categories, thresholds, template }: CreateEventForm) {
  const { submitEvent, isPending, status } = useCreateEventForm(template);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedThreshold, setSelectedThreshold] = useState(null);

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

  console.log(selectedThreshold, thresholds);
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
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          required>
          <option
            value='null'
            disabled>
            Select event type...
          </option>
          <List
            data={categories}
            component={({ item: cat }) => {
              return <option value={cat.id}>{capitalize(cat.label)}</option>;
            }}
          />
        </select>
        {selectedCategory && (
          <Sublabel>
            {categories.find(c => c.id == selectedCategory)?.description || 'No description.'}
          </Sublabel>
        )}
      </div>

      <div className='form-input-group'>
        <select
          name='event_threshold_id'
          value={selectedThreshold || 'null'}
          onChange={e => {
            setSelectedThreshold(e.target.value);
          }}
          required>
          <option
            value='null'
            disabled>
            Select event size...
          </option>
          <List
            data={thresholds}
            component={({ item }) => {
              return <option value={item.id}>{capitalize(item.label)}</option>;
            }}
          />
        </select>
        {selectedThreshold && (
          <Sublabel>
            {thresholds.find(t => t.id == selectedThreshold)?.description || 'No description.'}
          </Sublabel>
        )}
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
