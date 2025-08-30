'use client';

import { useState } from 'react';
import { ThresholdsType, useCreateEventFormContext } from '../create-event-form';
import { capitalize } from '@/util/capitalize';
import { Sublabel } from '@/components/ui/sub-label';
import { List } from '@/components/feature/list-temp';

export function EventTypeSelector({ thresholds }: { thresholds: ThresholdsType }) {
  const { payload, handleChange } = useCreateEventFormContext();
  const [selectedThreshold, setSelectedThreshold] = useState(
    () =>
      thresholds.find(t => t.id == parseInt(payload.get('event_threshold_id')?.toString()))?.id || 0
  );

  return (
    <div className='form-input-group'>
      <select
        name='event_threshold_id'
        value={selectedThreshold}
        onChange={e => {
          handleChange(e);
          setSelectedThreshold(e.target.value as any);
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
            return <option value={item.id}>{capitalize(item.label)}</option>;
          }}
        />
      </select>
      {selectedThreshold !== 0 && (
        <Sublabel>
          {thresholds.find(t => t.id == selectedThreshold)?.description || 'No description.'}
        </Sublabel>
      )}
    </div>
  );
}
