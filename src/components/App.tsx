'use client';

import { useEffect } from 'react';

export function App({ children }: React.PropsWithChildren) {
  // On page load and resize:
  function setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

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

    window.addEventListener('resize', setVh);
    setVh();
  }, []);

  return children;
}
