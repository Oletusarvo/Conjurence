'use client';

import { useEffect } from 'react';

export function App({ children }: React.PropsWithChildren) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('Service worker registered:', reg);
        return navigator.serviceWorker.ready;
      });
    }

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notifications allowed');
      }
    });
  }, []);

  return children;
}
