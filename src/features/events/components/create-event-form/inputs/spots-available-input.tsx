'use client';

import { Input } from '@/components/input-temp';
import { Armchair } from 'lucide-react';
import { useCreateEventFormContext } from '../create-event-form';

export function SpotsAvailableInput() {
  const { payload, template, handleChange, inputStatus } = useCreateEventFormContext();

  return (
    <Input
      min={1}
      onChange={e => handleChange(e)}
      icon={<Armchair />}
      name='spots_available'
      placeholder='Spots available...'
      type='number'
      defaultValue={template?.spots_available || payload.get('spots_available')?.toString()}
    />
  );
}
