'use client';

import { useDistanceContext } from '@/features/distance/providers/distance-provider';
import { getDistanceString } from '../util/get-distance-string';
import { Distance } from './distance-temp';

export function DistanceBadge() {
  const { distance } = useDistanceContext();
  const distanceString = getDistanceString(distance);

  return <Distance>{distanceString}</Distance>;
}
