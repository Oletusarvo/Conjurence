'use client';

import { useCreateEventFormContext } from '../CreateEventForm';
import { eventDescriptionSchema } from '@/features/events/schemas/eventSchema';
import { EventError } from '@/errors/events';
import { Sublabel } from '@/components/ui/Sublabel';

export function DescriptionInput() {
  const { handleChange, template, payload, inputStatus } = useCreateEventFormContext();

  return (
    <div className='form-input-group flex-1'>
      <textarea
        autoComplete='off'
        onChange={e => handleChange(e, eventDescriptionSchema)}
        name='description'
        placeholder='Description...'
        required
        spellCheck={false}
        defaultValue={template?.description || payload.get('description')?.toString()}
        className='w-full h-full'
      />
      {inputStatus.description === EventError.descriptionTooLong ? (
        <Sublabel variant='error'>The description is too long!</Sublabel>
      ) : null}
    </div>
  );
}
