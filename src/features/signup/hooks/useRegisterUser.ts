import toast from 'react-hot-toast';
import { useStatus } from '../../../hooks/useStatus';
import { registerCredentialsSchema } from '@/features/signup/schemas/registerCredentialsSchema';
import { registerUserAction } from '@/features/signup/actions/registerUserAction';
import { FormEvent } from 'react';
import { parseFormDataUsingSchema } from '@/util/parseUsingSchema';
import { useRouter } from 'next/navigation';
import { AuthError, TAuthError } from '@/errors/auth';

export function useRegisterUser() {
  const [status, isPending, setStatus] = useStatus<TAuthError>();
  const router = useRouter();
  const submitCredentials = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const payload = new FormData(e.currentTarget);
    const parseResult = parseFormDataUsingSchema(payload, registerCredentialsSchema);

    if (parseResult.success) {
      try {
        const res = await registerUserAction(payload);
        if (res.success === true) {
          toast.success('Registration succeeded!');
          router.replace('/login');
        } else {
          setStatus(res.error);
          toast.error('An unexpected error occured!');
        }
      } catch (err) {
        setStatus('error');
      }
    } else {
      const msg = parseResult.error.issues.at(0)?.message || null;
      setStatus(msg as TAuthError);
    }
    setStatus('idle');
  };

  return {
    submitCredentials,
    status,
    isPending,
  };
}
