import { useCallback, useEffect, useRef } from 'react';

type TTimeoutContainer = {
  timeout: NodeJS.Timeout;
  start: number;
};

export function useTimeout() {
  const timeoutMap = useRef(new Map<string, TTimeoutContainer>()).current;

  /**Adds a new timeout for the given key. Will clear and replace the old if one exists.*/
  const addTimeout = (key: string, cb: () => void | Promise<void>, t: number) => {
    const ot = timeoutMap.get(key);
    if (ot) {
      clearTimeout(ot.timeout);
    }
    const nt = setTimeout(cb, t);
    timeoutMap.set(key, {
      timeout: nt,
      start: Date.now(),
    });
  };

  const removeTimeout = (key: string) => {
    const t = timeoutMap.get(key);
    if (t) {
      clearTimeout(t.timeout);
      timeoutMap.delete(key);
    }
  };

  const getTimeLeft = (key: string) => {
    const t = timeoutMap.get(key);
    if (!t) return 0;
    return Date.now() - t.start;
  };

  useEffect(() => {
    return () => {
      for (const [key, val] of timeoutMap) {
        clearTimeout(val.timeout);
        timeoutMap.delete(key);
      }
    };
  }, []);

  return { addTimeout, removeTimeout, getTimeLeft };
}
