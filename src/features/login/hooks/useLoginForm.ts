import { useStatus } from '@/hooks/useStatus';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';

export function useLoginForm() {
  const [status, isPending, setStatus, setIsPending] = useStatus();
  const router = useRouter();
  const callbackUrl = useSearchParams().get('callback_url');

  const submitCredentials = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const credentials = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await signIn('Credentials', {
        ...credentials,
        redirect: false,
      });

      if (res) {
        if (res.ok) {
          const url = callbackUrl || '/app/feed';
          router.push(url);
        } else {
          toast.error(res.error);
          setStatus(res.error);
        }
      }
    } catch (err: any) {
      toast.error(err.message);
      setStatus(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { status, submitCredentials, isPending };
}
