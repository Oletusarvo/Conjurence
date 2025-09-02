'use client';

import { useCreateEventFormContext } from '../create-event-form';
import { eventDescriptionSchema } from '@/features/events/schemas/event-schema';
import { EventError } from '@/features/events/errors/events';
import { Sublabel } from '@/components/ui/sub-label';

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
