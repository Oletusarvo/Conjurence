import { useState } from 'react';

export function useStatus<T extends string>() {
  const [status, setStatus] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  return [status, isPending, setStatus, setIsPending] as const;
}
