import { useState } from 'react';

type BaseStatus = 'idle' | 'loading' | 'error' | 'success';
export function useStatus<T extends string = never>() {
  type Status = T | BaseStatus;
  const [status, setStatus] = useState<Status>('idle');
  const isPending = status === 'loading';
  return [status, isPending, setStatus] as const;
}
