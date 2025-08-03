import { useCallback, useEffect } from 'react';

/**Calls the given callback if a click is detected outside the given ref-object.*/
export function useActionOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: TODO
) {
  const handleClickOutside = useCallback(
    (e: any) => {
      const target = ref.current;
      if (!target) return;
      if (!target.contains(e.target)) {
        callback();
      }
    },
    [ref.current]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);
}
