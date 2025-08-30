import { FormContainer } from '@/components/form-temp';
import { Spinner } from '@/components/ui/spinner-temp';
import { LoginForm } from '@/features/login/components/login-form';
import { Suspense } from 'react';

export default async function LoginPage() {
  return (
    <div className='flex flex-col gap-2 flex-1 w-full justify-center px-default items-center'>
      <FormContainer>
        <h2>Login</h2>
        <Suspense fallback={<Spinner />}>
          <LoginForm />
        </Suspense>
      </FormContainer>
    </div>
  );
}
