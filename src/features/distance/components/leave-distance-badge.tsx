'use client';

import { ArrowUp } from 'lucide-react';
import { useDistanceContext } from '../providers/distance-provider';
import { getDistanceString } from '../util/get-distance-string';
import { Distance } from './distance-temp';

export function LeaveDistanceBadge() {
  const { leaveThreshold } = useDistanceContext();
  const distanceString = getDistanceString(leaveThreshold);

  return (
    <Distance
      IconComponent={ArrowUp}
      color='var(--color-red-500)'>
      {distanceString}
    </Distance>
  );
}
