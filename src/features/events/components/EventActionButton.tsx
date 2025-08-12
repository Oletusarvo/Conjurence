'use client';

import { withLoader } from '@/hoc/withLoader';
import { useEventContext } from '@/features/events/providers/EventProvider';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useMemo, useState } from 'react';
import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useModalStackContext } from '@/providers/ModalStackProvider';
import { Dialog } from '@/components/Dialog';
import { useEventActionContext } from '../providers/EventActionProvider';
import { endEventAction } from '../actions/endEventAction';

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
  const attendance = useUserAttendanceContext();
  const attendanceRecord = attendance.getAttendanceByEventId(event.id);
  const hideButton =
    attendanceRecord?.status === 'left' || attendanceRecord?.status === 'canceled' || false;

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
  const { endEvent } = useEventActionContext();
  const attendance = useUserAttendanceContext();
  const { pushModal } = useModalStackContext();

  const currentAttendance = attendance.getAttendanceByEventId(event.id);
  const userIsHost = currentAttendance?.status === 'host' || false;
  const { isPending } = useEventActionContext();

  function ConfirmDialog({ children, title, confirmContent, cancelContent, action }) {
    const [isPending, setIsPending] = useState(false);
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
        title={title}
        cancelButton={
          <button
            className='--outlined --accent --full-width'
            onClick={closeCurrentModal}
            disabled={isPending}>
            {cancelContent}
          </button>
        }
        confirmButton={
          <ConfirmButton
            onClick={async () => {
              setIsPending(true);
              await action();
              setIsPending(false);
              closeCurrentModal();
            }}
            disabled={isPending}
            loading={isPending}>
            {confirmContent}
          </ConfirmButton>
        }>
        <p>{children}</p>
      </Dialog>
    );
  }

  const buttonConfig = useMemo((): { label: string; action: () => Promise<void> } => {
    if (currentAttendance) {
      if (currentAttendance.status === 'host') {
        return {
          label: 'End Event',
          action: async () => {
            pushModal(
              <ConfirmDialog
                title='Confirm Event Ending'
                cancelContent={'Cancel'}
                confirmContent={'End Event'}
                action={async () => await endEvent()}>
                Are you sure you want to end the event? This cannot be undone.
              </ConfirmDialog>
            );
          },
        };
      } else if (currentAttendance.status === 'interested') {
        return {
          label: 'Cancel Interest',
          action: async () => {
            pushModal(
              <ConfirmDialog
                title='Confirm Interest Cancel'
                cancelContent={'Cancel'}
                confirmContent={'Yes, Cancel Interest'}
                action={async () => await attendance.cancelInterest(event.id)}>
                Are you sure you wish to cancel your interest in the event? This cannot be undone.
              </ConfirmDialog>
            );
          },
        };
      } else if (currentAttendance.status === 'joined') {
        return {
          label: 'Leave Event',
          action: async () => {
            pushModal(
              <ConfirmDialog
                title='Confirm Leave'
                cancelContent={'Cancel'}
                confirmContent={'Yes, leave'}
                action={async () => await attendance.leave(event.id)}>
                Are you sure you want to leave the event? This cannot be undone.
              </ConfirmDialog>
            );
          },
        };
      }
    }
    return {
      label: "I'm Interested",
      action: async () => {
        pushModal(
          <ConfirmDialog
            title='Confirm Interest'
            cancelContent='Cancel'
            confirmContent="Yes, I'm Interested!"
            action={async () => await attendance.showInterest(event.id)}>
            No pressure — marking interest just means you’re genuinely considering showing up. It
            helps hosts get a feel for the crowd and keeps things flowing naturally. Sound good?
          </ConfirmDialog>
        );
      },
    };
  }, [currentAttendance?.status, userIsHost, event.id]);

  return { buttonConfig, isPending };
};
