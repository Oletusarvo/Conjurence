'use client';

import { useDistance } from '@/features/distance/hooks/useDistance';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { getThresholdAdjusted } from '../util/getThresholdAdjusted';
import { useGeolocationContext } from '@/features/geolocation/providers/GeolocationProvider';
import { useEventContext } from '@/features/events/providers/EventProvider';

const [DistanceContext, useDistanceContext] = createContextWithUseHook<{
  distance: number;
  joinThreshold: number;
  leaveThreshold: number;
  distancePending: boolean;
}>('useDistanceContext can only be called within the context of a DistanceContext!');

export function DistanceProvider({ children }: React.PropsWithChildren) {
  const { position } = useGeolocationContext();
  const { distance, isPending } = useDistance();
  const { event } = useEventContext();
  const joinThreshold = getThresholdAdjusted(
    event?.auto_join_threshold,
    position?.coords.accuracy || 0,
    event?.position_accuracy
  );

  const leaveThreshold = getThresholdAdjusted(
    event?.auto_leave_threshold,
    position?.coords.accuracy || 0,
    event?.position_accuracy
  );

  return (
    <DistanceContext.Provider
      value={{ distance, joinThreshold, leaveThreshold, distancePending: isPending }}>
      {children}
    </DistanceContext.Provider>
  );
}

export { useDistanceContext };
