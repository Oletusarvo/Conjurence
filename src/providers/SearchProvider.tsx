'use client';

import { Input } from '@/components/Input';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { debounce } from '@/util/network/debounce';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const [SearchContext, useSearchProvider] = createContextWithUseHook<{ order: 'desc' | 'asc' }>(
  'useSearchProvider can only be called within the scope of a SearchContext!'
);

export function SearchProvider({ children }: React.PropsWithChildren) {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  return (
    <SearchContext.Provider value={{ order }}>
      <div className='flex gap-2 w-full'>
        <SearchBar />
        <SortButton
          currentOrder={order}
          onChange={val => setOrder(val)}
        />
      </div>
      {children}
    </SearchContext.Provider>
  );
}

function SortButton({
  currentOrder,
  onChange,
}: {
  currentOrder: 'asc' | 'desc';
  onChange: (val: 'asc' | 'desc') => void;
}) {
  return (
    <button
      className='--no-default'
      onClick={() => {
        onChange(currentOrder === 'asc' ? 'desc' : 'asc');
      }}>
      {currentOrder === 'asc' ? <ChevronDown /> : <ChevronUp />}
    </button>
  );
}

function SearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQuery = debounce((paramName: string, paramValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, paramValue);
    const newUrl = pathname + '?' + params.toString();
    router.replace(newUrl);
  }, 500);

  return (
    <div className='flex gap-2 w-full'>
      <Input
        type='search'
        placeholder='Search...'
        onChange={e => {
          updateQuery('q', e.target.value);
        }}
      />
    </div>
  );
}

export { useSearchProvider };
