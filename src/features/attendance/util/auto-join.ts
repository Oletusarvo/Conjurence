import { getThresholdAdjusted } from '@/features/distance/util/get-threshold-adjusted';

export function adjustedProximityThreshold(
  baseThreshold: number,
  a1: number,
  a2: number,
  k: number = 1.0
) {
  const sigma = Math.sqrt(a1 * a1 + a2 * a2);
  return baseThreshold + k * sigma;
}

export function shouldJoin(
  d_measured: number,
  a1: number,
  a2: number,
  baseJoinThreshold: number,
  k: number = 1.0
) {
  return d_measured <= getThresholdAdjusted(baseJoinThreshold, a1, a2);
}

export function shouldLeave(
  d_measured: number,
  a1: number,
  a2: number,
  baseLeaveThreshold: number,
  k: number = 1.0
) {
  return d_measured > getThresholdAdjusted(baseLeaveThreshold, a1, a2);
}
