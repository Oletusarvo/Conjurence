'use client';

import { useEffect } from 'react';

export function WindowResizeManager() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // On page load and resize:
    function setVh() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    window.addEventListener('resize', setVh);
    setVh();

    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);

  return null;
}
