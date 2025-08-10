import { FormContainer } from '@/components/Form';
import { Spinner } from '@/components/Spinner';
import { LoginForm } from '@/features/login/components/LoginForm';
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
