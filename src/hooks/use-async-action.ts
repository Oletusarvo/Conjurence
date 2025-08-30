import { useState } from 'react';

export function useAsyncAction<ArgsT extends any[], TData, TError extends string>(
  action: (...args: ArgsT) => Promise<ActionResponse<TData, TError>>
) {
  const [status, setStatus] = useState('idle');
  const enhanced = async (...args: TODO) => {
    try {
      setStatus('loading');
      const res = await action(...args);
      if (res.success === false) {
        setStatus(res.error);
      } else {
        setStatus('success');
      }
      return res;
    } catch (err) {
      setStatus('error');
      throw err;
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return [enhanced, status, status === 'loading'] as const;
}
