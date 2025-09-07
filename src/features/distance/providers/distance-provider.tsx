'use client';

import { useDistance } from '@/features/distance/hooks/use-distance';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { getThresholdAdjusted } from '../util/get-threshold-adjusted';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useEventContext } from '@/features/events/providers/event-provider';
import { useEventPositionContext } from '@/features/events/providers/event-position-provider';

export type TDistanceHistory = {
  position: GeolocationPosition;
  eventPosition: { accuracy: number; timestamp: number };
  distance: number;
};

const [DistanceContext, useDistanceContext] = createContextWithUseHook<{
  distance: number;
  joinThreshold: number;
  leaveThreshold: number;
  distancePending: boolean;
}>('useDistanceContext can only be called within the context of a DistanceContext!');

/**Provides distance-data between an event and the user. */
export function DistanceProvider({ children }: React.PropsWithChildren) {
  const { position } = useGeolocationContext();
  const { distance, isPending } = useDistance();
  const { event } = useEventContext();
  const { position: eventPosition } = useEventPositionContext();
  const eventPositionAccuracy = eventPosition?.accuracy || 0;

  const joinThreshold = getThresholdAdjusted(
    event?.auto_join_threshold,
    position?.coords.accuracy || 0,
    eventPositionAccuracy
  );

  const leaveThreshold = getThresholdAdjusted(
    event?.auto_leave_threshold,
    position?.coords.accuracy || 0,
    eventPositionAccuracy
  );

  return (
    <DistanceContext.Provider
      value={{
        distance,
        joinThreshold,
        leaveThreshold,
        distancePending: isPending,
      }}>
      {children}
    </DistanceContext.Provider>
  );
}

export { useDistanceContext };
