'use client';

import { useEffect } from 'react';

export function NotificationsManager() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notifications allowed');
      }
    });
  }, []);

  return null;
}
