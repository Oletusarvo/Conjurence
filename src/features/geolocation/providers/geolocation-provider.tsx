'use client';

import { getDistanceInMeters } from '@/features/distance/util/get-distance-in-meters';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const [GeolocationContext, useGeolocationContext] = createContextWithUseHook<{
  position: GeolocationPosition | null;
  distanceToPreviousPosition: number;
}>('useGeolocationContext can only be used within the scope of a GeolocationContext!');

/**Retrieves the current position of the device using the geolocation-api, and serves it through its context. */
export function GeolocationProvider({ children }: React.PropsWithChildren) {
  const [position, setPosition] = useSessionStorage<GeolocationPosition | null>('incant-pos', null);
  const [previousPosition, setPreviousPosition] = useState(null);

  const distanceToPreviousPosition =
    position && previousPosition
      ? getDistanceInMeters(position.coords, previousPosition.coords)
      : Infinity;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let geoWatcher;
    if ('geolocation' in navigator) {
      const options: PositionOptions = {
        enableHighAccuracy: false,
        maximumAge: 10000,
        timeout: Infinity,
      };

      geoWatcher = navigator.geolocation.watchPosition(
        pos => {
          if (position) {
            setPreviousPosition(position);
          }

          setPosition(pos);
        },
        error => {
          console.log(error);
          toast.error('To use the app, geolocation has to be enabled!');
        },
        options
      );
    } else {
      throw new Error('Geolocation unavailable!');
    }

    return () => {
      navigator.geolocation.clearWatch(geoWatcher);
    };
  }, []);

  return (
    <GeolocationContext.Provider value={{ position, distanceToPreviousPosition }}>
      {children}
    </GeolocationContext.Provider>
  );
}

export { useGeolocationContext };
