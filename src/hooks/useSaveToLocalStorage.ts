import { useEffect } from 'react';

export function useSaveToSessionStorage<T, K extends string>(value: T, key: K) {
  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(key, typeof value !== 'string' ? JSON.stringify(value) : value);
  }, [value, key]);
}
