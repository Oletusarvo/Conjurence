import { CreateEventForm } from '@/features/events/components/CreateEventForm/CreateEventForm';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { FormContainer } from '@/components/Form';
import { loadSession } from '@/util/loadSession';

export default async function CreateEventPage({ searchParams }) {
  const session = await loadSession();
  const { template_id } = await searchParams;

  let templateRecord = null;
  if (template_id) {
    templateRecord = await db(tablenames.event_data).where({ id: template_id }).first();

    //Check that the template is by the logged in user.
    if (templateRecord.author_id !== session.user.id) {
      return <span>Only the author of a template can use it!</span>;
    }
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

  const thresholds = await db({ et: tablenames.event_threshold })
    .leftJoin(
      db
        .select('event_threshold_id', 'description')
        .from(tablenames.event_threshold_description)
        .as('etd'),
      'etd.event_threshold_id',
      'et.id'
    )
    .where('et.id', '<=', session.user.subscription.maximum_event_size_id)
    .select('et.id', 'et.label', 'etd.description');

  return (
    <div className='flex flex-col px-default w-full flex-1 items-center'>
      <FormContainer>
        <h2>Create event</h2>
        <CreateEventForm
          categories={categories}
          thresholds={thresholds}
          template={templateRecord}
        />
      </FormContainer>
    </div>
  );
}
