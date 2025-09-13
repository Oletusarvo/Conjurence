import { CreateEventForm } from '@/features/events/components/create-event-form/create-event-form';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { FormContainer } from '@/components/form-temp';
import { loadSession } from '@/util/load-session';
import { EventProvider } from '@/features/events/providers/event-provider';
import { eventService } from '@/features/events/services/event-service';
import { eventTemplateService } from '@/features/events/services/event-template-service';

export default async function CreateEventPage({ searchParams }) {
  const session = await loadSession();
  const { template_id } = await searchParams;

  let templateRecord = null;
  if (template_id) {
    templateRecord = await eventTemplateService.repo.findTemplateById(template_id, db);
    //Check that the template is by the logged in user.
    if (templateRecord.author_id !== session.user.id) {
      return <span>Only the author of a template can use it!</span>;
    }
  }

  return (
    <div className='flex flex-col w-full flex-1 items-center'>
      <FormContainer>
        <div className='px-default'>
          <h2>Create event</h2>
        </div>

        <EventProvider initialEvent={templateRecord}>
          <CreateEventForm />
        </EventProvider>
      </FormContainer>
    </div>
  );
}
