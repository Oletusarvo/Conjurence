import { maxHistorySize, TDistanceHistory } from '@/features/distance/providers/distance-provider';

/**Returns true if the predicate return true on all entries of distanceHistory; false otherwise. */
export function handleGeofence(
  distanceHistory: TDistanceHistory[],
  predicate: (distance: TDistanceHistory) => boolean
) {
  if (distanceHistory.length < maxHistorySize) return false;
  for (const r of distanceHistory) {
    if (!predicate(r)) {
      return false;
    }
  }
  return true;
}
