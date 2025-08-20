'use client';

import { useRegisterUser } from '@/features/signup/hooks/useRegisterUser';
import { Input } from '../../../components/Input';
import { AtSign, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { withLoader } from '@/hoc/withLoader';
import { AuthError } from '@/errors/auth';
import { useRef } from 'react';
import { PasswordInput } from '@/components/PasswordInput';
import { Notice } from '@/components/Notice';
import { Form } from '@/components/Form';
import Link from 'next/link';
import { CheckboxInput } from '@/components/CheckboxInput';

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

  return (
    <Form
      ref={formRef}
      onSubmit={submitCredentials}>
      <div className='form-input-group'>
        <Input
          icon={<Mail />}
          name='email'
          type='email'
          placeholder='Email...'
          required
        />
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
      </div>

      <PasswordInput
        min={8}
        max={16}
        name='password1'
        placeholder='Type a password...'
        required
      />
      <div className='form-input-group'>
        <PasswordInput
          min={8}
          max={16}
          name='password2'
          placeholder='Re-type password...'
          required
        />
      </div>

      <div className='flex w-full items-center justify-between'>
        <CheckboxInput
          label={
            <span className='w-full text-sm'>
              I accept the{' '}
              <Link
                href='/terms.pdf'
                target='_blank'>
                terms of service and privacy policy
              </Link>
            </span>
          }
          required
          type='checkbox'
          name='terms_accepted'
          component={props => <input {...props} />}
        />
      </div>

      <div className='flex gap-2 w-full'>
        <button
          onClick={() => router.push('/')}
          className='--outlined --secondary --full-width'
          type='button'>
          Cancel
        </button>
        <SubmitButton
          loading={isPending}
          disabled={isPending}>
          Register
        </SubmitButton>
      </div>

      {status === AuthError.duplicateEmail ? (
        <Notice variant='error'>The email is already taken!</Notice>
      ) : status === AuthError.emailInvalidDomain ? (
        <Notice variant='error'>Only gmail is allowed!</Notice>
      ) : status === AuthError.passwordInvalidFormat ? (
        <Notice variant='error'>
          Password must contain numbers, letters and special characters!
        </Notice>
      ) : status === AuthError.passwordTooShort ? (
        <Notice variant='error'>Password must be at least 8 characters long!</Notice>
      ) : status === AuthError.passwordTooLong ? (
        <Notice variant='error'>Password cannot be longer than 16 characters!</Notice>
      ) : status === AuthError.duplicateUsername ? (
        <Notice variant='error'>The username is already taken!</Notice>
      ) : status === 'error' ? (
        <Notice variant='error'>An unexpected error occured!</Notice>
      ) : status === 'success' ? (
        <Notice variant='success'>Signup successful! Redirecting you to the login page...</Notice>
      ) : status === AuthError.passwordMismatch ? (
        <Notice variant='error'>The passwords do not match!</Notice>
      ) : null}
    </Form>
  );
}
