'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

/**@deprecated */
export function useDataStream<T extends any[]>(endpoint: string) {
  const buffer = useRef<T>([] as T);
  const interval = useRef(null);
  const stream = useRef<EventSource>(null);
  const [data, setData] = useState<T>([] as T);

  useEffect(() => {
    stream.current = new EventSource(endpoint, { withCredentials: false });
    stream.current.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        toast.success(data);
        buffer.current.push(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    interval.current = setInterval(() => {
      if (buffer.current?.length) {
        setData(prev => [...prev, ...buffer.current] as T);
        buffer.current = [] as T;
      }
    }, 500);
    return () => {
      stream.current?.close();
      clearInterval(interval.current);
    };
  }, []);

  return data;
}
