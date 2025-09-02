'use client';

import { Input } from '@/components/input-temp';
import { useCreateEventFormContext } from '../create-event-form';
import { eventLocationTitleSchema } from '@/features/events/schemas/event-schema';
import { Pin } from 'lucide-react';
import { Sublabel } from '@/components/ui/sub-label';
import { EventError } from '@/features/events/errors/events';

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
        defaultValue={payload.get('location_title')?.toString()}
      />
      {inputStatus.location_title === EventError.locationTooShort ? (
        <Sublabel variant='error'>The location is too short!</Sublabel>
      ) : inputStatus.location_title === EventError.locationTooLong ? (
        <Sublabel variant='error'>The location is too long!</Sublabel>
      ) : null}
    </div>
  );
}
