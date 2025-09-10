'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function WebGeolocationManager({ onPosition }) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const watchOptions = {
      enableHighAccuracy: false,
      maximumAge: 3000,
      //timeout: Infinity,
    };
    let geoWatcher;

    if ('geolocation' in navigator) {
      geoWatcher = navigator.geolocation.watchPosition(
        pos => onPosition(pos),
        error => {
          console.log(error);
          toast.error('To use the app, geolocation has to be enabled!');
        },
        watchOptions
      );
    } else {
      throw new Error('Geolocation unavailable on this platform!');
    }

    return () => {
      navigator.geolocation?.clearWatch(geoWatcher);
    };
  }, []);

  return null;
}
