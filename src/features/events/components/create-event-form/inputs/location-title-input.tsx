'use client';

import { Input } from '@/components/input-temp';
import { useCreateEventFormContext } from '../create-event-form';
import { Pin } from 'lucide-react';
import { Sublabel } from '@/components/ui/sub-label';
import { EventError } from '@/features/events/errors/events';

export function LocationTitleInput() {
  const { inputStatus } = useCreateEventFormContext();

  return (
    <div className='form-input-group'>
      <Input
        autoComplete='off'
        icon={<Pin />}
        name='location_title'
        placeholder='Location title...'
        required
      />
    </div>
  );
}
