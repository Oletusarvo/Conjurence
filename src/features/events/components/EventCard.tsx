import { Armchair, AtSign, MapPin, Star } from 'lucide-react';
import { Pill } from '../../../components/Pill';
import { useClassName } from '@/hooks/useClassName';
import { EventStatusBadge } from './EventStatusBadge';
import { useToggle } from '@/hooks/useToggle';
import axios from 'axios';
import { useAttendanceContext } from '@/features/attendance/providers/AttendanceProvider';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ModalStackProvider, useModalStackContext } from '@/providers/ModalStackProvider';
import { Dialog } from '@/components/Dialog';
import { withLoader } from '@/hoc/withLoader';
import { useEventContext } from '../providers/EventProvider';
import { ToggleProvider } from '@/providers/ToggleProvider';

export type EventCardProps = {
  onClick?: () => void;
};

export function EventCard({ ...props }: EventCardProps) {
  const { event, hasEnded } = useEventContext();
  const cardClassName = useClassName('card cursor-pointer', hasEnded ? '--expired' : '');
  const router = useRouter();

  return (
    <ModalStackProvider>
      <div
        {...props}
        onClick={() => router.push('/app/event/' + event.id)}
        className={cardClassName}>
        <CardHeader />
        <p className='tracking-tight leading-[18px]'>{event.description || 'No description'}</p>
        <CardFooter />
      </div>
    </ModalStackProvider>
  );
}

function InterestButton({ ...props }) {
  const { event, interestCount } = useEventContext();
  const { getAttendanceByEventId } = useAttendanceContext();
  const thisEventParticipation = getAttendanceByEventId(event.id);
  const { addAttendanceRecord } = useAttendanceContext();
  const [selected, toggleSelected] = useToggle(!!thisEventParticipation);

  const isHost = thisEventParticipation?.status === 'host';
  const { pushModal } = useModalStackContext();

  function ConfirmInterestDialog({ onConfirm = null }) {
    const { closeCurrentModal } = useModalStackContext();

    const { mutate, isPending, status } = useMutation({
      mutationKey: [`event-${event.id}-interest`],
      mutationFn: async () => {
        //startTransition(() => setOptimisticCount(c => c + 1));
        try {
          const res = await axios.post('/api/events/toggle_interest', {
            data: {
              eventId: event.id,
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
            onClick={() => {
              onConfirm();
              mutate(null, {
                onSuccess: () => closeCurrentModal(),
              });
            }}
            disabled={isPending}
            loading={status === 'pending'}>
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

  const pushConfirmModal = () => {
    pushModal(<ConfirmInterestDialog onConfirm={() => toggleSelected(true)} />);
  };

  return (
    <button
      {...props}
      //onClick={pushConfirmModal}
      disabled={!!thisEventParticipation}
      className='flex gap-2 items-center --no-default'>
      <Star
        size={'var(--text-2xl)'}
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
        <MapPin size={'var(--text-sm)'} />
        <span>{event.location || 'No location.'}</span>
      </div>
    </div>
  );
}
