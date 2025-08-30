import { FormContainer } from '@/components/form-temp';
import db from '@/dbconfig';
import { CreateEventForm } from '@/features/events/components/create-event-form/create-event-form';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/load-session';

export default async function CreateEventFromTemplatePage({ params }) {
  const { template_id } = await params;
  const session = await loadSession();
  const [author_id] = await db(tablenames.event_data).where({ id: template_id }).pluck('author_id');

  //Check that the template is by the logged in user.
  if (author_id !== session.user.id) {
    return <span>Only the author of a template can use it!</span>;
  }

  const templateRecord = await db(tablenames.event_data).where({ id: template_id }).first();
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
          template={templateRecord}
          thresholds={thresholds}
        />
      </FormContainer>
    </div>
  );
}
