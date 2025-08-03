import { Armchair, AtSign, MapPin, Star } from 'lucide-react';
import { Pill } from '../../../components/Pill';
import { useClassName } from '@/hooks/useClassName';
import { EventStatusBadge } from './EventStatusBadge';
import { useState } from 'react';
import { useEventSocket } from '@/features/events/hooks/useEventSocket';
import { useToggle } from '@/hooks/useToggle';
import axios from 'axios';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { TEvent } from '@/features/events/schemas/eventSchema';
import { useAttendanceContext } from '@/features/attendance/providers/AttendanceProvider';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export type EventCardProps = {
  event: TEvent;
  onClick?: () => void;
};

export function EventCard({ event, ...props }: EventCardProps) {
  const cardClassName = useClassName('card cursor-pointer');
  const router = useRouter();

  return (
    <div
      {...props}
      //onClick={() => router.push('/app/event/' + event.id)}
      className={cardClassName}>
      <CardHeader
        createdAt={event.created_at}
        title={event.title}
        category={event.category}
        spotsAvailable={event.spots_available}
        host={event.host}
      />
      <p className='tracking-tight leading-[18px]'>{event.description || 'No description'}</p>
      <CardFooter event={event} />
    </div>
  );
}

function InterestButton({ event, ...props }) {
  const { user } = useUserContext();
  const { addAttendanceRecord, attendanceRecords } = useAttendanceContext();
  const thisEventParticipation = attendanceRecords.find(
    p => p.user_id === user.id && p.event_instance_id === event.id
  );
  const [selected, toggleSelected] = useToggle(!!thisEventParticipation);
  const [count, setCount] = useState(event.interested_count);
  //const [optimisticCount, setOptimisticCount] = useOptimistic(event.interested_count);
  //const [transitionPending, startTransition] = useTransition();
  const isHost = thisEventParticipation?.status === 'host';

  const mutation = useMutation({
    mutationKey: [`event-${event.id}-interest`],
    mutationFn: async () => {
      //startTransition(() => setOptimisticCount(c => c + 1));
      try {
        const res = await axios.post('/api/events/toggle_interest', {
          data: {
            eventId: event.id,
            userId: user?.id,
          },
        });
        if (res.status === 200) {
          addAttendanceRecord(res.data);
        }
      } catch (err) {
        console.log(err.message);
      }
    },
  });

  useEventSocket({
    eventId: event.id,
    onInterest: ({ currentInterestCount }) => {
      setCount(currentInterestCount);
    },
  });

  return (
    <button
      {...props}
      disabled={!!thisEventParticipation}
      onClick={() => {
        toggleSelected(true);
        mutation.mutate();
      }}
      className='flex gap-2 items-center --no-default'>
      <Star
        size={'var(--text-2xl)'}
        fill={isHost ? 'var(--color-green-500)' : selected ? 'var(--color-accent)' : null}
      />
      <span>{count}</span>
    </button>
  );
}

function CardHeader({ title, category, spotsAvailable, host, createdAt }) {
  return (
    <div className='flex w-full items-start justify-between'>
      <div className='flex flex-col justify-start items-start gap-1'>
        <h3>{title}</h3>

        <div className='flex items-center gap-1 text-sm'>
          <AtSign size={'var(--text-sm)'} />
          {host}
        </div>
        <div className='flex gap-2'>
          <Pill
            variant='outlined'
            size='small'
            color='accent'>
            {category || 'Other'}
          </Pill>
          <Pill
            variant='outlined'
            size='small'>
            <div className='flex gap-2 items-center'>
              <Armchair size={'var(--text-sm)'} />
              <span>{spotsAvailable}</span>
            </div>
          </Pill>
        </div>
      </div>

      <EventStatusBadge createdAt={createdAt} />
    </div>
  );
}

function CardFooter({ event }) {
  return (
    <div className='flex justify-between gap-2 w-full text-sm font-semibold'>
      <div className='flex items-center gap-4'>
        <InterestButton event={event} />
      </div>

      <div className='flex gap-1 items-center'>
        <MapPin size={'var(--text-sm)'} />
        <span>{event.location || 'No location.'}</span>
      </div>
    </div>
  );
}
