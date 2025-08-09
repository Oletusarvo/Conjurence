import { AuthError, TAuthError } from '@/errors/auth';
import { useStatus } from '@/hooks/useStatus';
import toast from 'react-hot-toast';
import { sendPasswordResetEmailAction } from '../actions/sendPasswordResetEmailAction';
import { resetPasswordAction } from '../actions/resetPasswordAction';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOnSubmit } from '@/hooks/useOnSubmit';

export function useResetPasswordForm() {
  const [status, isPending, setStatus, resetStatus] = useStatus<TAuthError>();
  const token = useSearchParams().get('token');
  const router = useRouter();

  const { onSubmit: submitEmail } = useOnSubmit({
    action: async payload => {
      setStatus('loading');
      const email = payload.get('email');
      await sendPasswordResetEmailAction(email.toString());
      return { success: true };
    },
    onSuccess: () => setStatus('success'),
    onError: () => setStatus('error'),
  });

  const { onSubmit: submitNewPassword } = useOnSubmit({
    action: async payload => {
      setStatus('loading');
      const { password1, password2 } = Object.fromEntries(payload);
      if (password1 !== password2) {
        return {
          success: false,
          error: AuthError.passwordMismatch,
        };
      }
      await resetPasswordAction(token, password1.toString());
      return { success: true };
    },
    onSuccess: () => setStatus('success'),
    onError: () => setStatus('error'),
    onFinished: () => {
      router.replace('/login');
    },
  });

  return {
    handleSubmit: token ? submitNewPassword : submitEmail,
    step: token ? 1 : 0,
    status,
    isPending,
  };
}
