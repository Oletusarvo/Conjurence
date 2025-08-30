'use client';

import { ArrowDown } from 'lucide-react';
import { useDistanceContext } from '../providers/distance-provider';
import { getDistanceString } from '../util/get-distance-string';
import { Distance } from './distance-temp';

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
