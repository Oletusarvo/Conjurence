import { CreateEventForm } from '@/features/events/components/CreateEventForm';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';

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

  return (
    <div className='flex flex-col px-default w-full flex-1 justify-center'>
      <div className='flex flex-col gap-2'>
        <h2>Create event</h2>
        <CreateEventForm categories={categories} />
      </div>
    </div>
  );
}
