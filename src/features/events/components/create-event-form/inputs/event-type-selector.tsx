'use client';

import { useState } from 'react';
import { ThresholdsType, useCreateEventFormContext } from '../create-event-form';
import { capitalize } from '@/util/capitalize';
import { Sublabel } from '@/components/ui/sub-label';
import { List } from '@/components/feature/list-temp';
import { eventSizes } from '@/features/events/schemas/event-size-schema';

export function EventTypeSelector() {
  const thresholds = eventSizes;
  const { payload, handleChange } = useCreateEventFormContext();
  const [selectedThreshold, setSelectedThreshold] = useState(
    () => thresholds.find(t => t == payload.get('size')?.toString()) || 'small'
  );

  return (
    <div className='form-input-group'>
      <select
        name='size'
        value={payload.get('size')?.toString()}
        onChange={e => {
          handleChange(e);
          //setSelectedThreshold(e.target.value as any);
        }}
        required>
        <option
          value={0}
          disabled>
          Select event size...
        </option>
        <List
          data={thresholds}
          component={({ item }) => {
            return <option value={item}>{capitalize(item)}</option>;
          }}
        />
      </select>
    </div>
  );
}
