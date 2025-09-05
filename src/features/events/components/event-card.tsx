'use client';

import { useClassName } from '@/hooks/use-class-name';
import { EventStatusBadge } from './ui/event-status-badge';
import { useRouter } from 'next/navigation';
import { ModalStackProvider } from '@/providers/modal-stack-provider';
import { useEventContext } from '../providers/event-provider';
import { DistanceBadge } from '../../distance/components/distance-badge';
import { JoinedCountBadge } from '@/features/attendance/components/joined-count-badge';
import { SpotsAvailableBadge } from './ui/spots-available-badge';
import { CategoryBadge } from './ui/category-badge';
import { HostBadge } from './host-badge';
import { InterestedCountBadge } from '../../attendance/components/interested-count-badge';
import React from 'react';

export type EventCardProps = React.PropsWithChildren & {
  onClick?: () => void;
};

export function EventCard({ children, ...props }: EventCardProps) {
  const { event, hasEnded } = useEventContext();
  const cardClassName = useClassName('card cursor-pointer relative');
  const router = useRouter();

  return (
    <ModalStackProvider>
      <div
        {...props}
        onClick={() => (event && !hasEnded ? router.push('/app/event/' + event.id) : null)}
        className={cardClassName}>
        <CardHeader>{children}</CardHeader>
        <p className='tracking-tight leading-[18px]'>{event?.description || 'No description'}</p>
        <CardFooter />
      </div>
    </ModalStackProvider>
  );
}

function CardHeader({ children }: React.PropsWithChildren) {
  const {
    event: { title },
  } = useEventContext();

  const childArray = React.Children.toArray(children);
  const hostBadge = childArray.find((c: any) => c.type === HostBadge);
  const statusBadge = childArray.find((c: any) => c.type === EventStatusBadge);

  return (
    <div className='flex w-full items-start justify-between'>
      <div className='flex flex-col justify-start items-start gap-1'>
        <h3>{title || 'Otsikko'}</h3>

        {hostBadge}
        <div className='flex gap-2'>
          <CategoryBadge />
          <SpotsAvailableBadge />
        </div>
      </div>

      {statusBadge}
    </div>
  );
}

function CardFooter() {
  const { hasEnded } = useEventContext();
  return (
    <div className='flex justify-between gap-2 w-full text-sm font-semibold'>
      <div className='flex items-center gap-4'>
        <InterestedCountBadge />
        <JoinedCountBadge />
      </div>

      {!hasEnded && <DistanceBadge />}
    </div>
  );
}
