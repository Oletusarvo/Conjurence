'use client';

import { List } from '@/components/feature/list-temp';
import { useCreateEventFormContext } from '../create-event-form';
import { capitalize } from '@/util/capitalize';
import { eventCategories } from '@/features/events/schemas/event-category-schema';

export function EventCategorySelector() {
  const { template } = useCreateEventFormContext();
  return (
    <div className='form-input-group'>
      <select
        defaultValue={template?.category}
        name='category'
        required>
        <option
          value={0}
          disabled>
          Select event type...
        </option>
        <List
          data={eventCategories}
          component={({ item: cat }) => {
            return <option value={cat}>{capitalize(cat)}</option>;
          }}
        />
      </select>
    </div>
  );
}
