import { TAuthError } from '@/errors/auth';
import { useOnSubmit } from '@/hooks/use-on-submit';
import { useStatus } from '@/hooks/use-status';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';

export function useLoginForm() {
  const router = useRouter();
  const callbackUrl = useSearchParams().get('callback_url');
  const {
    onSubmit: submitCredentials,
    isPending,
    status,
  } = useOnSubmit({
    action: async payload => {
      const credentials = Object.fromEntries(payload);
      const res = await signIn('Credentials', {
        ...credentials,
        redirect: false,
      });

      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, error: res.error };
      }
    },
    onSuccess: async () => {
      router.push(callbackUrl || '/app/feed');
    },
  });

  return { status, submitCredentials, isPending };
}
