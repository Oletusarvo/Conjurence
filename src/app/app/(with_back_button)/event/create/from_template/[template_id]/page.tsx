import db from '@/dbconfig';
import { CreateEventForm } from '@/features/events/components/CreateEventForm';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';

export default async function CreateEventFromTemplatePage({ params }) {
  const { template_id } = await params;
  const session = await loadSession();
  const templateRecord = await db(tablenames.event_data).where({ id: template_id }).first();

  //Check that the template is by the logged in user.
  if (templateRecord.author_id !== session.user.id) {
    return <span>Only the author of a template can use it!</span>;
  }

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
    <div className='flex flex-col px-2 w-full flex-1 justify-center'>
      <h2>Create event</h2>
      <CreateEventForm
        categories={categories}
        template={templateRecord}
      />
    </div>
  );
}
