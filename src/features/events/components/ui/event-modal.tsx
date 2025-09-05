'use client';

import { Modal } from '@/components/modal-temp';
import { EventProvider, useEventContext } from '../../providers/event-provider';
import { useModalStackContext } from '@/providers/modal-stack-provider';
import { EventOverviewContainer } from './event-overview-container';
import { EventHeader } from './event-header';
import { EventDescription } from './event-description';
import { EventActionProvider } from '../../providers/event-action-provider';
import { ConfirmInterestDialog } from '@/features/attendance/components/dialogs/confirm-interest-dialog';
import { EventActionButton } from '../event-action-button';
import { ToggleProvider } from '@/providers/toggle-provider';
import { EventActionDialog } from '../event-action-dialog';

export function EventModal({ event }) {
  const { setModal } = useModalStackContext();

  return (
    <EventProvider initialEvent={event}>
      <EventActionProvider>
        <Modal
          onClose={() => setModal(null)}
          show={true}
          title={event.title}
          fullHeight>
          <div className='flex flex-col w-full'>
            <EventOverviewContainer>
              <EventHeader />
              <EventDescription />
            </EventOverviewContainer>
          </div>
          <div className='mt-auto px-default py-2 w-full flex gap-2'>
            <button
              className='--outlined --secondary --full-width'
              onClick={() => setModal(null)}>
              Close
            </button>

            <ToggleProvider>
              <ToggleProvider.Trigger>
                <EventActionButton />
              </ToggleProvider.Trigger>
              <ToggleProvider.Target>
                <EventActionDialog />
              </ToggleProvider.Target>
            </ToggleProvider>
          </div>
        </Modal>
      </EventActionProvider>
    </EventProvider>
  );
}
