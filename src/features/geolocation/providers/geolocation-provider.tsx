'use client';

import { useSessionStorage } from '@/hooks/use-session-storage';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { calcAveragePosition } from '../util/calc-average-position';

const [GeolocationContext, useGeolocationContext] = createContextWithUseHook<{
  position: GeolocationPosition | null;
}>('useGeolocationContext can only be used within the scope of a GeolocationContext!');

/**Retrieves the current position of the device using the geolocation-api, and serves it through its context. */
export function GeolocationProvider({ children }: React.PropsWithChildren) {
  const [position, setPosition] = useSessionStorage<GeolocationPosition | null>('incant-pos', null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let geoWatcher;
    if ('geolocation' in navigator) {
      const options: PositionOptions = {
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: Infinity,
      };

      geoWatcher = navigator.geolocation.watchPosition(
        pos => {
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

  return <GeolocationContext.Provider value={{ position }}>{children}</GeolocationContext.Provider>;
}

export { useGeolocationContext };
