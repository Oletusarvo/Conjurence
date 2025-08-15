import { useCallback, useEffect, useRef } from 'react';

type TTimeoutContainer = {
  timeout: NodeJS.Timeout;
  start: number;
  /**Optional function fired if the timeout is removed; either explicitly, or during unmount. */
  cleanup?: () => void;
};

export function useTimeout() {
  const timeoutMap = useRef(new Map<string, TTimeoutContainer>()).current;

  /**Adds a new timeout for the given key. Will clear and replace the old if one exists.*/
  const addTimeout = (
    key: string,
    cb: () => void | Promise<void>,
    t: number,
    cleanup?: () => void
  ) => {
    const ot = timeoutMap.get(key);
    if (ot) {
      clearTimeout(ot.timeout);
    }
    const nt = setTimeout(cb, t);
    timeoutMap.set(key, {
      timeout: nt,
      start: Date.now(),
      cleanup,
    });
  };

  const removeTimeout = (key: string) => {
    const t = timeoutMap.get(key);
    if (t) {
      clearTimeout(t.timeout);

      if (t.cleanup) {
        t.cleanup();
      }
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
      for (const key of timeoutMap.keys()) {
        removeTimeout(key);
      }
    };
  }, []);

  return { addTimeout, removeTimeout, getTimeLeft };
}
