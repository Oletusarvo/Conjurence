import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function useInfiniteScroll(initialPage: number = 0, queryFn: () => Promise<TODO>) {
  const [page, setPage] = useState(initialPage);
  const { inView, ref: observedRef } = useInView();

  useEffect(() => {
    if (inView === true) {
      setPage(prev => prev + 1);
    }
  }, [inView]);

  return { page, observedRef };
}
