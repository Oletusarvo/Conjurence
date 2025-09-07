import { useEffect, useState } from 'react';

function getValue<T>(key: string, initialValue?: T): T {
  if (typeof sessionStorage === 'undefined') {
    return initialValue;
  }

  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : initialValue;
}

export function useSessionStorage<T>(key: string, initialValue?: T) {
  const [value, setValue] = useState(() => getValue(key, initialValue));

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(key, typeof value !== 'string' ? JSON.stringify(value) : value);
  }, [value, key]);

  return [value, setValue] as const;
}
