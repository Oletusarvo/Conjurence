'use client';

import { withLoader } from '@/hoc/withLoader';
import { MapPin } from 'lucide-react';
import { withIcon } from '@/hoc/withIcon';
import { useDistanceContext } from '@/features/distance/providers/DistanceProvider';

export function DistanceBadge() {
  const { distance, distancePending } = useDistanceContext();
  const Component = withIcon(
    withLoader(({ children, ...props }) => {
      return <div className='flex gap-1 items-center'>{children}</div>;
    })
  );

  const unit = distance < 1000 ? 'm' : 'km';
  const distanceString = (
    Math.round((distance < 1000 ? distance : distance / 1000) * 100) / 100
  ).toLocaleString('fi');

  return (
    <Component
      loading={distancePending}
      icon={<MapPin size={'14px'} />}>
      {distanceString}
      {unit}
    </Component>
  );
}
