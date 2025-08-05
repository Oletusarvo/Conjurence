import { Armchair, AtSign, MapPin, Star } from 'lucide-react';
import { Pill } from '../../../components/Pill';
import { useClassName } from '@/hooks/useClassName';
import { EventStatusBadge } from './EventStatusBadge';
import { useToggle } from '@/hooks/useToggle';
import { useAttendanceContext } from '@/features/attendance/providers/AttendanceProvider';
import { useRouter } from 'next/navigation';
import { ModalStackProvider } from '@/providers/ModalStackProvider';
import { useEventContext } from '../providers/EventProvider';

export type EventCardProps = {
  onClick?: () => void;
};

export function EventCard({ ...props }: EventCardProps) {
  const { event, hasEnded } = useEventContext();
  const cardClassName = useClassName('card cursor-pointer relative', hasEnded ? '--expired' : '');
  const router = useRouter();

  return (
    <ModalStackProvider>
      <div
        {...props}
        onClick={() => (event ? router.push('/app/event/' + event.id) : null)}
        className={cardClassName}>
        {hasEnded && <div className='absolute top-0 left-0 backdrop-blur-xs w-full h-full'></div>}

        <CardHeader />
        <p className='tracking-tight leading-[18px]'>{event?.description || 'No description'}</p>
        <CardFooter />
      </div>
    </ModalStackProvider>
  );
}

function InterestButton({ ...props }) {
  const { event, interestCount } = useEventContext();
  const { getAttendanceByEventId } = useAttendanceContext();
  const thisEventParticipation = getAttendanceByEventId(event.id);
  const [selected] = useToggle(!!thisEventParticipation);

  const isHost = thisEventParticipation?.status === 'host';

  return (
    <button
      {...props}
      //onClick={pushConfirmModal}
      disabled={!!thisEventParticipation}
      className='flex gap-2 items-center --no-default'>
      <Star
        size={'24px'}
        fill={isHost ? 'var(--color-green-500)' : selected ? 'var(--color-accent)' : null}
      />
      <span>{interestCount}</span>
    </button>
  );
}

function CardHeader() {
  const {
    event: { title, host, category, spots_available, created_at },
  } = useEventContext();
  return (
    <div className='flex w-full items-start justify-between'>
      <div className='flex flex-col justify-start items-start gap-1'>
        <h3>{title || 'Otsikko'}</h3>

        <div className='flex items-center gap-1 text-sm'>
          <AtSign size={'14px'} />
          {host || 'host'}
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
              <Armchair size={'14px'} />
              <span>{spots_available}</span>
            </div>
          </Pill>
        </div>
      </div>

      <EventStatusBadge createdAt={new Date(created_at).toString()} />
    </div>
  );
}

function CardFooter() {
  const { event, hasEnded } = useEventContext();
  return (
    <div className='flex justify-between gap-2 w-full text-sm font-semibold'>
      <div className='flex items-center gap-4'>
        {!hasEnded ? <InterestButton event={event} /> : null}
      </div>

      <div className='flex gap-1 items-center'>
        <MapPin size={'14px'} />
        <span>{event.location || 'No location.'}</span>
      </div>
    </div>
  );
}
