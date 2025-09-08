'use client';

import { useCreateEventFormContext } from '../create-event-form';
import { EventError } from '@/features/events/errors/events';
import { Sublabel } from '@/components/ui/sub-label';
import { createEventSchema } from '@/features/events/schemas/event-schema';

export function DescriptionInput() {
  const { template, inputStatus } = useCreateEventFormContext();
  const error = inputStatus?.description?.errors;

  return (
    <div className='form-input-group flex-1'>
      <textarea
        autoComplete='off'
        //onChange={e => handleChange(e, createEventSchema.shape.description)}
        name='description'
        placeholder='Description...'
        required
        spellCheck={false}
        defaultValue={template?.description}
        className='w-full h-full'
      />
      {error?.includes(EventError.descriptionTooLong) ? (
        <Sublabel variant='error'>Description too long!</Sublabel>
      ) : null}
    </div>
  );
}
