'use client';

import { Input } from '@/components/Input';
import { useCreateEventFormContext } from '../CreateEventForm';
import { eventLocationTitleSchema } from '@/features/events/schemas/eventSchema';
import { Pin } from 'lucide-react';
import { Sublabel } from '@/components/Sublabel';
import { EventError } from '@/errors/events';

export function LocationTitleInput() {
  const { payload, template, handleChange, inputStatus } = useCreateEventFormContext();

  return (
    <div className='form-input-group'>
      <Input
        autoComplete='off'
        onChange={e => {
          handleChange(e, eventLocationTitleSchema);
        }}
        icon={<Pin />}
        name='location_title'
        placeholder='Location title...'
        required
        defaultValue={template?.location_title || payload.get('location_title')?.toString()}
      />
      {inputStatus.location_title === EventError.locationTooShort ? (
        <Sublabel variant='error'>The location is too short!</Sublabel>
      ) : inputStatus.location_title === EventError.locationTooLong ? (
        <Sublabel variant='error'>The location is too long!</Sublabel>
      ) : null}
    </div>
  );
}
