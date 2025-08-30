import { createClassName } from '@/util/create-class-name';
import { useMemo } from 'react';

/**Combines the passed class names using the createClassName utility function, wrapping it in useMemo, with the passed class names as its dependency. */
export function useClassName(...classNames: string[]) {
  return useMemo(() => {
    return createClassName(...classNames);
  }, [classNames]);
}
