import { registerCredentialsSchema } from '@/features/signup/schemas/registerCredentialsSchema';
import { registerUserAction } from '@/features/signup/actions/registerUserAction';
import { useRouter } from 'next/navigation';
import { useOnSubmit } from '@/hooks/useOnSubmit';

export function useRegisterUser() {
  const router = useRouter();

  const { onSubmit, isPending, status } = useOnSubmit({
    action: async payload => {
      return await registerUserAction(payload);
    },
    onSuccess: () => {
      router.push('/login');
    },
    validationSchema: registerCredentialsSchema,
  });

  return {
    submitCredentials: onSubmit,
    status,
    isPending,
  };
}
