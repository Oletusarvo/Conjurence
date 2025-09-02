'use client';

import { useSessionStorage } from '@/hooks/use-session-storage';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const historyMaxSize = 3;

const [GeolocationContext, useGeolocationContext] = createContextWithUseHook<{
  position: GeolocationPosition | null;
  positionHistory: GeolocationPosition[];
}>('useGeolocationContext can only be used within the scope of a GeolocationContext!');

/**Retrieves the current position of the device using the geolocation-api, and serves it through its context. */
export function GeolocationProvider({ children }: React.PropsWithChildren) {
  const [position, setPosition] = useSessionStorage<GeolocationPosition | null>('incant-pos', null);
  const positionHistory = useRef([]);

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
          positionHistory.current.push(pos);
          if (positionHistory.current.length >= historyMaxSize) {
            positionHistory.current.shift();
          }
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
    <GeolocationContext.Provider value={{ position, positionHistory: positionHistory.current }}>
      {children}
    </GeolocationContext.Provider>
  );
}

export { useGeolocationContext };
