'use client';

import { Input } from '@/components/input-temp';
import { Armchair } from 'lucide-react';
import { useCreateEventFormContext } from '../create-event-form';
import { EventError } from '@/features/events/errors/events';
import { Sublabel } from '@/components/ui/sub-label';

export function SpotsAvailableInput() {
  const { template, inputStatus } = useCreateEventFormContext();
  const error = inputStatus?.spots_available?.errors;
  return (
    <div className='form-input-group'>
      <Input
        defaultValue={template?.spots_available || 2}
        min={1}
        icon={<Armchair />}
        name='spots_available'
        placeholder='Spots available...'
        type='number'
      />
      {error?.length ? <Sublabel variant='error'>{error.at(0)}</Sublabel> : null}
    </div>
  );
}
