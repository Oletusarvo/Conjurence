import { CreateEventForm } from '@/features/events/components/CreateEventForm';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';

export default async function CreateEventPage() {
  const categories = await db(tablenames.event_category);
  return (
    <div className='flex flex-col px-2 w-full flex-1 justify-center'>
      <h2>Create event</h2>
      <CreateEventForm categories={categories} />
    </div>
  );
}
