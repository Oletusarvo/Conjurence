'use client';

import { withLoader } from '@/hoc/withLoader';
import { useEventContext } from '@/features/events/providers/EventProvider';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useMemo, useState } from 'react';
import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useModalStackContext } from '@/providers/ModalStackProvider';
import { Dialog } from '@/components/Dialog';
import { useEventActionContext } from '../providers/EventActionProvider';

/**
 * Renders the button displayed on the app/event/[event_id] page.
 * Does a different action based on the participant status of the user:
 * User is not joined - will make a new join request.
 * User has made a request, but is still pending - will cancel the request.
 * User is host - will end the event.
 * User is joined - will leave the event.
 *
 * @todo Implement handling for when users are rejected.
 * @todo Implement handling for when users have left.
 */

export function EventActionButton(props: React.ComponentProps<'button'>) {
  const { user, sessionStatus } = useUserContext();
  const { event } = useEventContext();
  const { buttonConfig, isPending } = useEventActionButton();
  const { getAttendanceByEventId } = useUserAttendanceContext();
  const attendanceRecord = getAttendanceByEventId(event.id);
  const hideButton =
    attendanceRecord?.status === 'interested' ||
    attendanceRecord?.status === 'joined' ||
    attendanceRecord?.status === 'left' ||
    false;

  return !hideButton ? (
    <Button
      {...props}
      type='button'
      loading={isPending || sessionStatus === 'loading'}
      disabled={props.disabled || isPending || !user}
      onClick={buttonConfig.action}>
      {buttonConfig.label}
    </Button>
  ) : null;
}

const Button = withLoader(({ children, ...props }) => (
  <button
    {...props}
    className='--outlined --accent mt-auto w-full'
    type='button'>
    {children}
  </button>
));

const useEventActionButton = () => {
  const { event } = useEventContext();
  const { getAttendanceByEventId } = useUserAttendanceContext();
  const { pushModal } = useModalStackContext();

  const attendance = getAttendanceByEventId(event.id);
  const userIsHost = attendance?.status === 'host' || false;
  const { isPending } = useEventActionContext();

  function ConfirmEndEventModal() {
    const { endEvent, isPending } = useEventActionContext();
    const { closeCurrentModal } = useModalStackContext();

    const ConfirmButton = withLoader(({ children, ...props }) => (
      <button
        {...props}
        className='--contained --accent --full-width'>
        {children}
      </button>
    ));

    return (
      <Dialog
        title='End Event'
        cancelButton={
          <button
            className='--outlined --accent --full-width'
            onClick={closeCurrentModal}
            disabled={isPending}>
            Cancel
          </button>
        }
        confirmButton={
          <ConfirmButton
            onClick={async () => {
              await endEvent();
              closeCurrentModal();
            }}
            disabled={isPending}
            loading={isPending}>
            Confirm
          </ConfirmButton>
        }>
        <p>Are you sure you want to end the event? This cannot be undone.</p>
      </Dialog>
    );
  }

  function ConfirmInterestDialog() {
    const [isPending, setIsPending] = useState(false);
    const { closeCurrentModal } = useModalStackContext();
    const { addAttendanceRecord, showInterest } = useUserAttendanceContext();

    const ConfirmButton = withLoader(({ children, ...props }) => (
      <button
        {...props}
        className='--contained --accent --full-width'>
        {children}
      </button>
    ));

    return (
      <Dialog
        title='Confirm Interest'
        cancelButton={
          <button
            className='--outlined --accent --full-width'
            onClick={closeCurrentModal}
            disabled={isPending}>
            Cancel
          </button>
        }
        confirmButton={
          <ConfirmButton
            onClick={async () => {
              setIsPending(true);
              await showInterest(event.id);
              setIsPending(false);
              closeCurrentModal();
            }}
            disabled={isPending}
            loading={isPending}>
            Yes, I'm Interested!
          </ConfirmButton>
        }>
        <p>
          No pressure — marking interest just means you’re genuinely considering showing up. It
          helps hosts get a feel for the crowd and keeps things flowing naturally. Sound good?
        </p>
      </Dialog>
    );
  }

  const buttonConfig = useMemo((): { label: string; action: () => Promise<void> } => {
    if (attendance) {
      if (attendance.status === 'host') {
        return {
          label: 'End Event',
          action: async () => {
            pushModal(<ConfirmEndEventModal />);
          },
        };
      }
    }
    return {
      label: "I'm Interested",
      action: async () => {
        pushModal(<ConfirmInterestDialog />);
      },
    };
  }, [attendance?.status, userIsHost]);

  return { buttonConfig, isPending };
};
