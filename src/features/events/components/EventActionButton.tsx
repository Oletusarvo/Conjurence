'use client';

import { withLoader } from '@/hoc/withLoader';
import { useEventContext } from '@/features/events/providers/EventProvider';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useMemo } from 'react';
import { useEventActions } from '../hooks/useEventActions';
import { useAttendanceContext } from '@/features/attendance/providers/AttendanceProvider';
import { useModalStackContext } from '@/providers/ModalStackProvider';
import { Dialog } from '@/components/Dialog';
import { useMutation } from '@tanstack/react-query';
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
  const { getAttendanceByEventId } = useAttendanceContext();
  const attendanceRecord = getAttendanceByEventId(event.id);
  const isInterested = attendanceRecord?.status === 'interested' || false;

  return !isInterested ? (
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
  const { getAttendanceByEventId } = useAttendanceContext();
  const { pushModal, closeCurrentModal } = useModalStackContext();

  const thisEventAttendance = getAttendanceByEventId(event.id);
  const userIsHost = thisEventAttendance?.status === 'host' || false;
  const { leaveEvent, cancelJoinRequest, isPending } = useEventActionContext();

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
    const { event } = useEventContext();
    const { user } = useUserContext();
    const { closeCurrentModal } = useModalStackContext();
    const { showInterest, isPending } = useEventActionContext();
    const { addAttendanceRecord } = useAttendanceContext();

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
              await showInterest();
              addAttendanceRecord({
                event_instance_id: event.id,
                status: 'interested',
                username: user.username,
              });
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
    if (thisEventAttendance) {
      if (thisEventAttendance.status === 'host') {
        return {
          label: 'End Event',
          action: async () => {
            pushModal(<ConfirmEndEventModal />);
          },
        };
      } else if (thisEventAttendance.status === 'pending') {
        return { label: 'Cancel Join Request', action: cancelJoinRequest };
      } else if (thisEventAttendance.status === 'joined') {
        return { label: 'Leave Event', action: leaveEvent };
      }
    }
    return {
      label: "I'm Interested",
      action: async () => {
        pushModal(<ConfirmInterestDialog />);
      },
    };
  }, [thisEventAttendance, userIsHost]);

  return { buttonConfig, isPending };
};
