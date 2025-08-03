'use client';

import { ReactNode, useMemo } from 'react';

type ListProps<T> = {
  data: T[];
  component: ({ item }: { item: T }) => ReactNode;
  sortFn?: (a: T, b: T) => number;
};

export function List<T>({ data, component: Component, sortFn }: ListProps<T>) {
  const sorted = sortFn ? data.sort(sortFn) : data;

  return useMemo(() => {
    return sorted.map((item, index) => {
      return (
        <Component
          key={`list-item-${JSON.stringify(item)}-${index}`}
          item={item}
        />
      );
    });
  }, [JSON.stringify(data), Component]);
}
