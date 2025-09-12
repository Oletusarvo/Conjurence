import { FormContainer } from '@/components/form-temp';
import { BetaNotice } from '@/components/ui/beta-notice';
import { Notice } from '@/components/ui/notice-temp';
import { Spinner } from '@/components/ui/spinner-temp';
import { RegisterForm } from '@/features/signup/components/register-form';
import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <div className='flex gap-2 flex-col flex-1 justify-center px-default items-center'>
      <FormContainer centered>
        <h2>Register</h2>
        <Suspense fallback={<Spinner />}>
          <RegisterForm />
        </Suspense>
        <Notice variant='default'>
          For now, registration is limited to Gmail addresses only as part of our early testing and
          spam prevention efforts. We plan to support more email providers soon.
        </Notice>
      </FormContainer>
    </div>
  );
}

<div
  className='text-yellow-100 mt-4 p-4 rounded-xl border border-yellow-500'
  style={{
    backgroundColor: 'hsl(from var(--color-yellow-500) h s l / 0.2)',
  }}>
  Please note we are not using email-verification at this time. It is your responsibility to
  remember what your email and password is. If however you do forget, don't hesitate to contact us
  so we can sort you out. Happy hangouts!
</div>;
