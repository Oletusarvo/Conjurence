'use client';

import { List } from '@/components/feature/list-temp';
import { CategoriesType, useCreateEventFormContext } from '../create-event-form';
import { capitalize } from '@/util/capitalize';
import { Sublabel } from '@/components/ui/sub-label';
import { useState } from 'react';

export function EventCategorySelector({ categories }: { categories: CategoriesType }) {
  const { payload, template, handleChange } = useCreateEventFormContext();
  const [selectedCategory, setSelectedCategory] = useState(
    () =>
      categories.find(
        c =>
          c.id == template?.event_category_id ||
          c.id == parseInt(payload.get('event_category_id')?.toString())
      )?.id || 0
  );

  return (
    <div className='form-input-group'>
      <select
        name='event_category_id'
        value={selectedCategory}
        onChange={e => {
          handleChange(e);
          setSelectedCategory(e.target.value as any);
        }}
        required>
        <option
          value={0}
          disabled>
          Select event type...
        </option>
        <List
          data={categories}
          component={({ item: cat }) => {
            return <option value={cat.id}>{capitalize(cat.label)}</option>;
          }}
        />
      </select>
      {selectedCategory !== 0 && (
        <Sublabel>
          {categories.find(c => c.id == selectedCategory)?.description || 'No description.'}
        </Sublabel>
      )}
    </div>
  );
}
