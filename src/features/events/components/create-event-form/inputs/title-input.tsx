'use client';

import { Input } from '@/components/input-temp';
import { Sublabel } from '@/components/ui/sub-label';
import { EventError } from '@/features/events/errors/events';
import { Heading } from 'lucide-react';
import { useCreateEventFormContext } from '../create-event-form';
import { createEventSchema } from '@/features/events/schemas/event-schema';

export function TitleInput() {
  const { payload, template, handleChange, inputStatus } = useCreateEventFormContext();

  return (
    <div className='form-input-group'>
      <Input
        autoComplete='off'
        onChange={e => {
          handleChange(e, createEventSchema.shape.title);
        }}
        icon={<Heading />}
        name='title'
        placeholder='Title...'
        required
        defaultValue={template?.title || payload.get('title')?.toString()}
      />
      {inputStatus.title === EventError.titleTooShort ? (
        <Sublabel variant='error'>The title is too short!</Sublabel>
      ) : inputStatus.title === EventError.titleTooLong ? (
        <Sublabel variant='error'>The title is too long!</Sublabel>
      ) : null}
    </div>
  );
}
