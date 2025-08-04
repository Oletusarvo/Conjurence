'use client';

import { withLoader } from '@/hoc/withLoader';
import { useEventContext } from '@/features/events/providers/EventProvider';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useMemo } from 'react';
import { useEventActions } from '../hooks/useEventActions';
import { useAttendanceContext } from '@/features/attendance/providers/AttendanceProvider';
import { useModalStackContext } from '@/providers/ModalStackProvider';

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
  const { buttonConfig, isPending } = useEventActionButton();

  return (
    <Button
      {...props}
      type='button'
      loading={isPending || sessionStatus === 'loading'}
      disabled={props.disabled || isPending || !user}
      onClick={buttonConfig.action}>
      {buttonConfig.label}
    </Button>
  );
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
  const { endEvent, leaveEvent, requestJoin, cancelJoinRequest, isPending } = useEventActions(
    event.id
  );

  const buttonConfig = useMemo((): { label: string; action: () => Promise<void> } => {
    if (thisEventAttendance) {
      if (thisEventAttendance.status === 'host') {
        return {
          label: 'End Event',
          action: async () => {
            pushModal({
              title: 'End Event',
              content: 'Are you sure you wish to end the event?',
              cancelButtonConfig: {
                content: 'No',
                props: { className: '--outlined --accent --full-width' },
              },
              confirmButtonConfig: {
                content: 'Yes',
                props: {
                  onClick: async () => {
                    closeCurrentModal();
                    await endEvent();
                  },
                  className: '--contained --accent --full-width',
                },
              },
            });
          },
        };
      } else if (thisEventAttendance.status === 'pending') {
        return { label: 'Cancel Join Request', action: cancelJoinRequest };
      } else if (thisEventAttendance.status === 'joined') {
        return { label: 'Leave Event', action: leaveEvent };
      }
    }
    return { label: 'Request Join', action: requestJoin };
  }, [thisEventAttendance, userIsHost]);

  return { buttonConfig, isPending };
};
