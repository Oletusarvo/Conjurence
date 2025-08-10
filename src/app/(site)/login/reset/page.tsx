import { Spinner } from '@/components/Spinner';
import { ResetPasswordForm } from '@/features/resetPassword/components/ResetPasswordForm';
import { Suspense } from 'react';

export default async function PasswordResetPage() {
  return (
    <div className='flex flex-col px-default gap-2 w-full flex-1 justify-center items-center'>
      <div className='flex flex-col gap-2'>
        <h2>Reset Your Password</h2>
        <Suspense fallback={<Spinner />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
