'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import { Form } from '@/components/Form';
import { Input } from '@/components/Input';
import { PasswordInput } from '@/components/PasswordInput';
import { withLoader } from '@/hoc/withLoader';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { Notice } from '@/components/ui/Notice';

const [ResetPasswordFormContext, useResetPasswordFormContext] = createContextWithUseHook<
  Omit<ReturnType<typeof useResetPasswordForm>, 'handleSubmit' | 'step'>
>('useResetPasswordFormContext can only be used within the context of a ResetPasswordFormContext!');

export function ResetPasswordForm() {
  const { handleSubmit, step, ...hook } = useResetPasswordForm();
  return (
    <ResetPasswordFormContext.Provider value={hook}>
      <Form onSubmit={handleSubmit}>{step === 0 ? <StepOne /> : <StepTwo />}</Form>
    </ResetPasswordFormContext.Provider>
  );
}

function StepOne() {
  const { status } = useResetPasswordFormContext();
  return (
    <>
      <div className='form-input-group'>
        <Input
          icon={<Mail />}
          name='email'
          placeholder='Type your email...'
          required
        />
      </div>
      <div className='flex gap-2 w-full'>
        <CancelButton>Cancel</CancelButton>
        <SubmitButton>Submit</SubmitButton>
      </div>
      {status === 'success' ? (
        <Notice variant='success'>
          Email sent successfully! Please check your inbox; don't forget the spam folder!
        </Notice>
      ) : status === 'error' ? (
        <Notice variant='error'>An unexpected error occured!</Notice>
      ) : null}
    </>
  );
}

function StepTwo() {
  const { status } = useResetPasswordForm();
  return (
    <>
      <div className='form-input-group'>
        <PasswordInput
          autoComplete='new-password'
          name='password1'
          placeholder='Type new password...'
          required
        />
      </div>

      <div className='form-input-group'>
        <PasswordInput
          autoComplete='new-password'
          name='password2'
          placeholder='Re-type password...'
          required
        />
      </div>
      <div className='flex gap-2 w-full'>
        <CancelButton>Cancel</CancelButton>
        <SubmitButton>Reset Password</SubmitButton>
      </div>
      {status === 'success' ? (
        <Notice variant='success'>Password changed successfully! Redirecting to login...</Notice>
      ) : null}
    </>
  );
}

const SubmitButton = ({ children, ...props }) => {
  const { isPending, status } = useResetPasswordFormContext();

  const Button = withLoader(({ children, ...props }) => {
    return (
      <button
        {...props}
        className='--contained --accent --full-width'
        type='submit'>
        {children}
      </button>
    );
  });

  return (
    <Button
      {...props}
      loading={isPending}
      disabled={isPending || status === 'success'}>
      {children}
    </Button>
  );
};

const CancelButton = ({ children, ...props }: React.ComponentProps<'button'>) => {
  return (
    <Link
      href='/login'
      className='w-full'>
      <button
        {...props}
        className='--outlined --secondary --full-width'
        type='button'>
        {children}
      </button>
    </Link>
  );
};
