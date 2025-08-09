import { useState } from 'react';

type BaseStatus = 'idle' | 'loading' | 'error' | 'success';
export function useStatus<T extends string = never>(initialStatus: T | BaseStatus = 'idle') {
  type Status = T | BaseStatus;
  const [status, setStatus] = useState<Status>(initialStatus);
  const isPending = status === 'loading';

  /**If status is set to loading, will return it back to idle. Otherwise leaves it as it is. */
  const resetStatus = () => setStatus(prev => (prev === 'loading' ? 'idle' : prev));

  return [status, isPending, setStatus, resetStatus] as const;
}
