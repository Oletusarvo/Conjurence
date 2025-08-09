import { Spinner } from '@/components/Spinner';
import { ResetPasswordForm } from '@/features/resetPassword/components/ResetPasswordForm';
import { Suspense } from 'react';

export default async function PasswordResetPage() {
  return (
    <div className='flex flex-col px-2 gap-2 w-full flex-1 justify-center'>
      <h2>Reset Your Password</h2>
      <Suspense fallback={<Spinner />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
