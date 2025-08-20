import { useState } from 'react';
import { CategoriesType, ThresholdsType, useCreateEventFormContext } from './CreateEventForm';
import { List } from '@/components/List';
import { capitalize } from '@/util/capitalize';
import { Sublabel } from '@/components/Sublabel';

export function TypesStep({
  categories,
  thresholds,
}: {
  categories: CategoriesType;
  thresholds: ThresholdsType;
}) {
  const { payload, template, handleChange } = useCreateEventFormContext();
  const [selectedCategory, setSelectedCategory] = useState(
    () =>
      categories.find(
        c =>
          c.id == template?.event_category_id ||
          c.id == parseInt(payload.get('event_category_id')?.toString())
      )?.id || 0
  );
  const [selectedThreshold, setSelectedThreshold] = useState(
    () =>
      thresholds.find(t => t.id == parseInt(payload.get('event_threshold_id')?.toString()))?.id || 0
  );

  return (
    <>
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
    </>
  );
}
