import { TAuthError } from '@/errors/auth';
import { useStatus } from '@/hooks/useStatus';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';

export function useLoginForm() {
  const [status, isPending, setStatus] = useStatus<TAuthError>();
  const router = useRouter();
  const callbackUrl = useSearchParams().get('callback_url');

  const submitCredentials = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const credentials = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await signIn('Credentials', {
        ...credentials,
        redirect: false,
      });

      if (res) {
        if (res.ok) {
          setStatus('success');
          const url = callbackUrl || '/app/feed';

          router.push(url);
        } else {
          toast.error(res.error);
          setStatus(res.error as TAuthError);
        }
      }
    } catch (err: any) {
      toast.error(err.message);
      setStatus(err.message);
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return { status, submitCredentials, isPending };
}
