'use client';

import { useDistanceContext } from '@/features/distance/providers/DistanceProvider';
import { getDistanceString } from '../util/getDistanceString';
import { Distance } from './Distance';

export function DistanceBadge() {
  const { distance } = useDistanceContext();
  const distanceString = getDistanceString(distance);

  return <Distance>~{distanceString}</Distance>;
}
