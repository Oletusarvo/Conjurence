'use client';

import { Input } from '@/components/input-temp';
import { Sublabel } from '@/components/ui/sub-label';
import { EventError } from '@/features/events/errors/events';
import { Heading } from 'lucide-react';
import { useCreateEventFormContext } from '../create-event-form';
import { createEventSchema } from '@/features/events/schemas/event-schema';

export function TitleInput() {
  const { template, inputStatus } = useCreateEventFormContext();
  const error = inputStatus?.title?.errors;
  return (
    <div className='form-input-group'>
      <Input
        defaultValue={template?.title}
        autoComplete='off'
        icon={<Heading />}
        name='title'
        placeholder='Title...'
        required
        // defaultValue={template?.title || payload.get('title')?.toString()}
      />
      {error?.includes(EventError.titleTooShort) ? (
        <Sublabel variant='error'>Title too short!</Sublabel>
      ) : error?.includes(EventError.titleTooLong) ? (
        <Sublabel variant='error'>Title too long!</Sublabel>
      ) : null}
    </div>
  );
}
