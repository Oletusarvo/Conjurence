import { useEffect, useMemo, useState } from 'react';

function getValue<T>(key: string, initialValue?: T): T {
  if (typeof sessionStorage === 'undefined') {
    return initialValue;
  }

  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : initialValue;
}

export function useSessionStorage<T>(key: string[], initialValue?: T, cleanupOnUnmount?: boolean) {
  const combinedKey = useMemo(() => key.join('-'), [key]);
  const [value, setValue] = useState(() => getValue(combinedKey, initialValue));

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(combinedKey, typeof value !== 'string' ? JSON.stringify(value) : value);

    return () => {
      if (cleanupOnUnmount) {
        sessionStorage.removeItem(combinedKey);
      }
    };
  }, [value, combinedKey]);

  return [value, setValue] as const;
}
