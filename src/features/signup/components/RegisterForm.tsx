'use client';

import { useRegisterUser } from '@/features/signup/hooks/useRegisterUser';
import { Input } from '../../../components/Input';
import { AtSign, Ellipsis, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Sublabel } from '../../../components/Sublabel';
import { withLoader } from '@/hoc/withLoader';
import { AuthError } from '@/errors/auth';
import { ReactNode, useRef } from 'react';

export function RegisterForm() {
  const router = useRouter();
  const { status, submitCredentials, isPending } = useRegisterUser();
  const formRef = useRef<HTMLFormElement>(null);

  const SubmitButton = withLoader(({ children, ...props }: React.ComponentProps<'button'>) => (
    <button
      {...props}
      className='--contained --accent --full-width'
      type='submit'>
      {children}
    </button>
  ));

  const hideIfPending = (element: ReactNode) => (!isPending ? element : null);

  return (
    <form
      ref={formRef}
      className='flex flex-col gap-2 sm:w-[450px] xs:w-full'
      onSubmit={submitCredentials}>
      <div className='form-input-group'>
        <Input
          icon={<Mail />}
          name='email'
          type='email'
          placeholder='Email...'
          required
        />
        {hideIfPending(
          status === AuthError.duplicateEmail ? (
            <Sublabel variant='error'>A user with this email already exists!</Sublabel>
          ) : status === AuthError.emailInvalidDomain ? (
            <Sublabel variant='error'>Only gmail is allowed!</Sublabel>
          ) : null
        )}
      </div>

      <div className='form-input-group'>
        <Input
          icon={<AtSign />}
          name='username'
          placeholder='Username...'
          min={3}
          max={24}
          required
        />
        {hideIfPending(
          status === AuthError.duplicateUsername ? (
            <Sublabel variant='error'>A user with this username already exists!</Sublabel>
          ) : null
        )}
      </div>

      <Input
        icon={<Ellipsis />}
        min={8}
        max={16}
        name='password1'
        type='password'
        placeholder='Type a password...'
        required
      />
      <div className='form-input-group'>
        <Input
          icon={<Ellipsis />}
          min={8}
          max={16}
          name='password2'
          type='password'
          placeholder='Re-type password...'
          required
        />
        {hideIfPending(
          status === AuthError.passwordInvalidFormat ? (
            <Sublabel variant='error'>
              Password must contain numbers, letters and special characters!
            </Sublabel>
          ) : status === AuthError.passwordTooShort ? (
            <Sublabel variant='error'>Password must be at least 8 characters long!</Sublabel>
          ) : status === AuthError.passwordTooLong ? (
            <Sublabel variant='error'>Password cannot be longer than 16 characters!</Sublabel>
          ) : null
        )}
      </div>

      <div className='flex w-full items-center justify-between'>
        <span className='w-full text-sm'>I accept the terms of service and privacy policy</span>
        <input
          required
          type='checkbox'
          name='terms_accepted'
        />
      </div>

      <div className='flex gap-2 w-full'>
        <button
          onClick={() => router.back()}
          className='--outlined --accent --full-width'
          type='button'>
          Cancel
        </button>
        <SubmitButton
          loading={isPending}
          disabled={isPending || status === 'success'}>
          Register
        </SubmitButton>
      </div>
    </form>
  );
}
