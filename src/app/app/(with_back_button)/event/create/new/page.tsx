import { CreateEventForm } from '@/features/events/components/CreateEventForm';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { FormContainer } from '@/components/Form';

export default async function CreateEventPage() {
  const categories = await db({ ec: tablenames.event_category })
    .leftJoin(
      db
        .select('event_category_id', 'description')
        .from(tablenames.event_category_description)
        .as('ecd'),
      'ec.id',
      'ecd.event_category_id'
    )
    .select('description', 'label', 'ec.id as id');

  const thresholds = await db({ et: tablenames.event_threshold })
    .leftJoin(
      db
        .select('event_threshold_id', 'description')
        .from(tablenames.event_threshold_description)
        .as('etd'),
      'etd.event_threshold_id',
      'et.id'
    )
    .select('et.id', 'et.label', 'etd.description');

  return (
    <div className='flex flex-col px-default w-full flex-1 justify-center items-center'>
      <FormContainer>
        <h2>Create event</h2>
        <CreateEventForm
          categories={categories}
          thresholds={thresholds}
        />
      </FormContainer>
    </div>
  );
}
