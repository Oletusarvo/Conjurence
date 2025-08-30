'use client';

import { useEffect, useRef } from 'react';

export function useAbortSignal() {
  const controllerRef = useRef<AbortController>(new AbortController());

  const getSignal = () => {
    controllerRef.current = new AbortController();
    return controllerRef.current.signal;
  };

  useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  return getSignal;
}
