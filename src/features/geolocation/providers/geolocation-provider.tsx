'use client';

import { getDistanceInMeters } from '@/features/distance/util/get-distance-in-meters';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { useState } from 'react';

import { Capacitor } from '@capacitor/core';
import { NativeGeolocationManager } from '../managers/native-geolocation-provider';
import { WebGeolocationManager } from '../managers/web-geolocation-manager';
import { useAppContext } from '@/providers/app-provider';
import { BackgroundGeolocationManager } from '../managers/background-geolocation-manager';

const [GeolocationContext, useGeolocationContext] = createContextWithUseHook<{
  position: GeolocationPosition | null;
  distanceToPreviousPosition: number;
}>('useGeolocationContext can only be used within the scope of a GeolocationContext!');

/**Retrieves the current position of the device using the geolocation-api, and serves it through its context. */
export function GeolocationProvider({ children }: React.PropsWithChildren) {
  const { isInBackground } = useAppContext();
  const [position, setPosition] = useSessionStorage<GeolocationPosition | null>(
    ['conjurence-user-position'],
    null
  );
  const [previousPosition, setPreviousPosition] = useState(null);

  const distanceToPreviousPosition =
    position && previousPosition
      ? getDistanceInMeters(position.coords, previousPosition.coords)
      : Infinity;

  const handlePositionChange = (pos: GeolocationPosition) => {
    if (position) {
      setPreviousPosition(position);
    }
    setPosition(pos);
  };

  return (
    <GeolocationContext.Provider value={{ position, distanceToPreviousPosition }}>
      {Capacitor.isNativePlatform() ? (
        <NativeGeolocationManager onPosition={pos => handlePositionChange(pos)} />
      ) : (
        <WebGeolocationManager onPosition={pos => handlePositionChange(pos)} />
      )}
      {isInBackground && (
        <BackgroundGeolocationManager onPosition={pos => handlePositionChange(pos)} />
      )}
      {children}
    </GeolocationContext.Provider>
  );
}

export { useGeolocationContext };
