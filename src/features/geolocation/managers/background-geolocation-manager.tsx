'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';
import type { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';
import { useUserContext } from '@/features/users/providers/user-provider';
import { Preferences } from '@capacitor/preferences';
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

export function BackgroundGeolocationManager({ onPosition }) {
  const { user } = useUserContext();
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return; // Only run on native (Android/iOS)
    const setup = async () => {
      return await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: 'Cancel to prevent battery drain.',
          backgroundTitle: 'Tracking You.',
          requestPermissions: true,
          stale: false,
          distanceFilter: 5, // updates only after user moves 50 meters
        },
        (location, error?: any) => {
          if (error) {
            console.error('Background geolocation error:', error);
          } else if (location) {
            // Send users location to the server, auto-joining or leaving them from nearby events automatically.
            /*onPosition({
              coords: {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy,
              },
              timestamp: location.time,
            });*/
          }
        }
      );
    };

    const watcherKey = 'bg-geo-watcher-id';
    Preferences.get({ key: watcherKey }).then(async id => {
      if (id.value) return;
      const newId = await setup();
      await Preferences.set({ key: watcherKey, value: newId });
    });
  }, []);

  return null;
}
