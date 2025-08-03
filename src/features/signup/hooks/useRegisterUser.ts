import toast from 'react-hot-toast';
import { useStatus } from '../../../hooks/useStatus';
import { registerCredentialsSchema } from '@/features/signup/schemas/registerCredentialsSchema';
import { registerUserAction } from '@/features/signup/actions/registerUserAction';
import { FormEvent } from 'react';
import { parseFormDataUsingSchema } from '@/util/parseUsingSchema';
import { useRouter } from 'next/navigation';

export function useRegisterUser() {
  const [status, isPending, setStatus, setIsPending] = useStatus();
  const router = useRouter();
  const submitCredentials = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const payload = new FormData(e.currentTarget);
    const parseResult = parseFormDataUsingSchema(payload, registerCredentialsSchema);

    if (parseResult.success) {
      const res = await registerUserAction(payload);
      setStatus(res);
      if (res === 'success') {
        toast.success('Registration succeeded!');
        router.replace('/login');
      } else if (status === 'error') {
        toast.error('An unexpected error occured!');
      }
    } else {
      const msg = parseResult.error.issues.at(0)?.message || null;
      setStatus(msg);
    }

    setIsPending(false);
  };

  return {
    submitCredentials,
    status,
    isPending,
  };
}
