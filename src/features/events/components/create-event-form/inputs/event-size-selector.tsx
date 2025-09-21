'use client';

import { capitalize } from '@/util/capitalize';
import { List } from '@/components/feature/list-temp';
import { eventSizes } from '@/features/events/schemas/event-size-schema';
import { useCreateEventFormContext } from '../create-event-form';

export function EventTypeSelector() {
  // const thresholds = eventSizes;
  const { template, sizes } = useCreateEventFormContext();
  return (
    <div className='form-input-group'>
      <select
        defaultValue={template?.size}
        name='size'
        required>
        <option
          value={0}
          disabled>
          Select event size...
        </option>
        <List<string>
          data={sizes}
          component={({ item }) => {
            return <option value={item}>{capitalize(item)}</option>;
          }}
        />
      </select>
    </div>
  );
}
