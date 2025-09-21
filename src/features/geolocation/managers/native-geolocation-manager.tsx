'use client';

import { useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export function NativeGeolocationManager({ onPosition }) {
  useEffect(() => {
    const watchOptions = {
      enableHighAccuracy: true,
      maximumAge: 3000,
      minimumUpdateInterval: 3000,
      //timeout: Infinity,
    };

    let geoWatcher;

    geoWatcher = Geolocation.watchPosition(watchOptions, (pos, err) => {
      if (err) {
        console.log(err);
      } else {
        onPosition(pos);
      }
    });

    return () => {
      Geolocation.clearWatch({ id: geoWatcher });
    };
  }, []);

  return null;
}
