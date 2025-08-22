'use client';

import { ArrowDown } from 'lucide-react';
import { useDistanceContext } from '../providers/DistanceProvider';
import { getDistanceString } from '../util/getDistanceString';
import { Distance } from './Distance';

export function JoinDistanceBadge() {
  const { joinThreshold } = useDistanceContext();
  const distanceString = getDistanceString(joinThreshold);

  return (
    <Distance
      IconComponent={ArrowDown}
      color='var(--color-green-500)'>
      {distanceString}
    </Distance>
  );
}
