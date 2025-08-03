'use client';

import { withIcon } from '@/hoc/withIcon';
import { withLoader } from '@/hoc/withLoader';
import { useClassName } from '@/hooks/useClassName';
import {
  ArrowLeft,
  CircleEllipsis,
  ClockFading,
  MegaphoneIcon,
  Meh,
  PartyPopper,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEventActionContext } from '../providers/EventActionProvider';
import { useUserContext } from '@/features/users/providers/UserProvider';

const ButtonWithIcon = withLoader(
  withIcon(({ children, variant = '--contained', ...props }) => {
    const className = useClassName('--accent', variant);
    return (
      <button
        {...props}
        className={className}>
        {children}
      </button>
    );
  })
);

const ButtonContainer = ({ children }) => (
  <div className='flex flex-col items-center mt-4 gap-2'>{children}</div>
);

const BackToFeedButton = () => (
  <Link href='/app/feed'>
    <ButtonWithIcon icon={<ArrowLeft />}>Back To Feed</ButtonWithIcon>
  </Link>
);

const Icon = ({ Component, color }) => (
  <Component
    color={color}
    size='var(--text-7xl)'
  />
);

export function EventEndedNotice() {
  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <Icon
        Component={ClockFading}
        color='var(--color-red-500)'
      />
      <h2>Event has ended!</h2>
      <p>
        Unfortunately the event you are trying to view, has ended. <br />
        But no worries, there are always new events happening, keep your eye out!
      </p>
      <ButtonContainer>
        <BackToFeedButton />
      </ButtonContainer>
    </div>
  );
}

export function EventAttendancePending() {
  return (
    <div className='flex flex-col w-full items-center gap-2 text-center'>
      <Icon
        color='var(--color-yellow-500)'
        Component={CircleEllipsis}
      />
      <h2>Your request is pending.</h2>{' '}
      <p>
        Didn't mean to join? It's alright, we all have butter-fingers sometimes. Click the button
        below to cancel your request.
        <br />
        Please note that you will not be able to re-request a join on this event for a period of
        time.
      </p>
      <ButtonContainer>
        <ButtonWithIcon icon={<X />}>Cancel Request</ButtonWithIcon>
      </ButtonContainer>
    </div>
  );
}

export function EventAttendanceAccepted() {
  const { cancelJoinRequest, isPending } = useEventActionContext();
  const { user } = useUserContext();

  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <Icon
        color='var(--color-green-500)'
        Component={PartyPopper}
      />
      <h2>You have been accepted!</h2>

      <ButtonContainer>
        <p>Remember to press the button below once you have arrived.</p>
        <ButtonWithIcon icon={<MegaphoneIcon />}>I Have Arrived!</ButtonWithIcon>
      </ButtonContainer>
      <ButtonContainer>
        <p>
          Second thoughts? Press the button below to cancel your arrival. Remember, you will not be
          able to rejoin the event for some time.
        </p>
        <ButtonWithIcon
          loading={isPending}
          disabled={!user || isPending}
          icon={<X />}
          variant='--outlined'
          onClick={cancelJoinRequest}>
          Cancel Arrival
        </ButtonWithIcon>
      </ButtonContainer>
    </div>
  );
}

export function EventAttendanceRejected() {
  return (
    <div className='flex flex-col gap-2 text-center'>
      <Icon
        color='var(--color-red-500)'
        Component={Meh}
      />
      <h2>Your request was rejected.</h2>
      <p>
        Oh dear, looks like your request was rejected. <br />
        No worries; better luck next time.
      </p>
      <ButtonContainer>
        <BackToFeedButton />
      </ButtonContainer>
    </div>
  );
}
