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
import { Spinner } from '@/components/Spinner';

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
    size='72px'
  />
);

export function EventEndedNotice({ variant }: { variant: 'host' | 'attendee' }) {
  const content =
    variant === 'attendee' ? (
      <p>
        This gathering has faded into the mist. <br />
        But don’t fret—fresh conjurings are always appearing. Keep your senses sharp for the next
        spectral meetup!
      </p>
    ) : (
      <p>
        Looks like you drifted a bit too far from your own gathering, so the event has been gently
        laid to rest. Next time, keep your spectral presence close and conjure up another meetup!
      </p>
    );
  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <Icon
        Component={ClockFading}
        color='var(--color-red-500)'
      />
      <h2>Event has ended!</h2>
      {content}
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

export function EventLeftNotice() {
  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <Icon
        Component={ClockFading}
        color='var(--color-red-500)'
      />
      <h2>You have left the event!</h2>
      <p>
        You have wandered too far from the event, and have been marked as left. Thanks for
        attending!
      </p>
      <ButtonContainer>
        <BackToFeedButton />
      </ButtonContainer>
    </div>
  );
}

export function AttendanceStatusNotice({ status }: { status: string }) {
  const content =
    status === 'joining' ? (
      <>
        <h2>Joining event...</h2>{' '}
        <p>Please stay close to the event. Moving too far will cancel the join.</p>
      </>
    ) : status === 'leaving' ? (
      <>
        <h2>Leaving event...</h2>{' '}
        <p>Please stay far from the event. Moving too close will cancel the leave.</p>
      </>
    ) : status === 'ending' ? (
      <>
        <h2>Ending event...</h2>
        <p>You are moving outside the event area. Staying away will end the event.</p>
      </>
    ) : null;

  return (
    <div className='flex flex-col w-full items-center gap-2 text-center'>
      <Icon
        color='var(--color-yellow-500)'
        Component={CircleEllipsis}
      />
      {content}
      <Spinner />
    </div>
  );
}
