import {
  registerCredentialsSchema,
  verifyEmailSchema,
} from '@/features/signup/schemas/registerCredentialsSchema';
import { registerUserAction } from '@/features/signup/actions/registerUserAction';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOnSubmit } from '@/hooks/useOnSubmit';
import { sendEmailVerificationAction } from '../actions/sendEmailVerificationAction';
import toast from 'react-hot-toast';

export function useRegisterUser() {
  const token = useSearchParams().get('token');
  const router = useRouter();

  const {
    onSubmit: submitCredentials,
    isPending: isCredentialsPending,
    status: credentialsStatus,
  } = useOnSubmit({
    action: async payload => {
      payload.set('token', token);
      return await registerUserAction(payload);
    },
    onSuccess: () => {
      router.push('/login');
    },
    onFailure: res => {
      toast.error(res.error);
    },
    onError: (err: any) => toast.error(err.message),
    validationSchema: registerCredentialsSchema,
  });

  const {
    onSubmit: submitEmail,
    isPending: isEmailPending,
    status: emailStatus,
  } = useOnSubmit({
    action: async payload => {
      return await sendEmailVerificationAction(payload);
    },
    validationSchema: verifyEmailSchema,
  });

  return {
    submitCredentials,
    submitEmail,
    emailStatus,
    credentialsStatus,
    isCredentialsPending,
    isEmailPending,
    token,
  };
}
