'use client';

import { useSessionStorage } from '@/hooks/useSessionStorage';
import { useToggle } from '@/hooks/useToggle';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const [GeolocationContext, useGeolocationContext] = createContextWithUseHook<{
  toggleLocationEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  position: GeolocationPosition | null;
  locationEnabled: boolean;
}>('useGeolocationContext can only be used within the scope of a GeolocationContext!');

export function GeolocationProvider({ children }: React.PropsWithChildren) {
  const [locationEnabled, toggleLocationEnabled] = useToggle(true);
  const [position, setPosition] = useSessionStorage<GeolocationPosition | null>('incant-pos', null);

  useEffect(() => {
    if (typeof window === 'undefined' || !locationEnabled) {
      return;
    }

    let geoWatcher;
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        pos => {
          console.log('Position: ', pos.coords);
          setPosition(pos);
        },
        error => toast.error('To use the app, geolocation has to be enabled!')
      );
    }
    return () => {
      navigator.geolocation.clearWatch(geoWatcher);
    };
  }, [locationEnabled]);

  return (
    <GeolocationContext.Provider value={{ locationEnabled, toggleLocationEnabled, position }}>
      {children}
    </GeolocationContext.Provider>
  );
}

export { useGeolocationContext };
