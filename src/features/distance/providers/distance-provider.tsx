'use client';

import { useDistance } from '@/features/distance/hooks/use-distance';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { getThresholdAdjusted } from '../util/get-threshold-adjusted';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useEventContext } from '@/features/events/providers/event-provider';
import { useEffect, useRef } from 'react';

export const maxHistorySize = 3;

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
  distanceHistory: TDistanceHistory[];
}>('useDistanceContext can only be called within the context of a DistanceContext!');

export function DistanceProvider({ children }: React.PropsWithChildren) {
  const { position } = useGeolocationContext();
  const { distance, isPending } = useDistance();
  const distanceHistory = useRef<TDistanceHistory[]>([]);
  const { event } = useEventContext();

  const eventPositionAccuracy = event?.position_metadata?.accuracy || 0;

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

  useEffect(() => {
    distanceHistory.current.push({
      position,
      eventPosition: event.position_metadata,
      distance,
    });
    if (distanceHistory.current.length >= maxHistorySize) {
      distanceHistory.current.shift();
    }
  }, [distance, position, event?.position_metadata]);

  return (
    <DistanceContext.Provider
      value={{
        distance,
        joinThreshold,
        leaveThreshold,
        distancePending: isPending,
        distanceHistory: distanceHistory.current,
      }}>
      {children}
    </DistanceContext.Provider>
  );
}

export { useDistanceContext };
