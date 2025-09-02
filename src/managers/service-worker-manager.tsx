'use client';

import { useEffect } from 'react';

export function ServiceWorkerManager() {
  useEffect(() => {
    //if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', {
          scope: './',
        })
        .then(registration => {
          let serviceWorker;
          if (registration.installing) {
            serviceWorker = registration.installing;
            console.log('Service worker installing...');
          }
          if (registration.waiting) {
            serviceWorker = registration.waiting;
            console.log('Service worker waiting...');
          }
          if (registration.active) {
            serviceWorker = registration.active;
            console.log('Service worker active.');
          }
          if (serviceWorker) {
            serviceWorker.addEventListener('statechange', e => {});
          }
        })
        .catch(err => {
          console.error(err.message);
        });
    }
  }, []);

  return null;
}
