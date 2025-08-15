'use client';

import { ArrowUp } from 'lucide-react';
import { useDistanceContext } from '../providers/DistanceProvider';
import { getDistanceString } from '../util/getDistanceString';
import { Distance } from './Distance';

export function LeaveDistanceBadge() {
  const { leaveThreshold } = useDistanceContext();
  const distanceString = getDistanceString(leaveThreshold);

  return (
    <Distance
      IconComponent={ArrowUp}
      color='var(--color-red-500)'>
      ~{distanceString}
    </Distance>
  );
}
