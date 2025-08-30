'use client';

import { useRegisterUser } from '@/features/signup/hooks/use-register-user';
import { Input } from '../../../components/input-temp';
import { AtSign, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { withLoader } from '@/hoc/with-loader';
import { AuthError } from '@/errors/auth';
import { useRef } from 'react';
import { PasswordInput } from '@/components/password-input';
import { Notice } from '@/components/ui/notice-temp';
import { Form } from '@/components/form-temp';
import Link from 'next/link';
import { CheckboxInput } from '@/components/checkbox-input';
import { Sublabel } from '@/components/ui/sub-label';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';

const [RegisterFormContext, useRegisterFormContext] = createContextWithUseHook<{
  isCredentialsPending: boolean;
  isEmailPending: boolean;
  credentialsStatus: string;
  emailStatus: string;
  token: string;
}>('useRegisterFormContext can only be called within the scope of a useRegisterFormContext!');

export function RegisterForm() {
  const {
    emailStatus,
    credentialsStatus,
    submitCredentials,
    submitEmail,
    isCredentialsPending,
    isEmailPending,
    token,
  } = useRegisterUser();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form
      ref={formRef}
      onSubmit={token ? submitCredentials : submitEmail}>
      <RegisterFormContext.Provider
        value={{ isCredentialsPending, isEmailPending, emailStatus, credentialsStatus, token }}>
        {!token ? <StepOne /> : <StepTwo />}
      </RegisterFormContext.Provider>
    </Form>
  );
}

function StepOne() {
  const router = useRouter();
  const { isEmailPending, emailStatus } = useRegisterFormContext();
  return (
    <>
      <div className='form-input-group'>
        <Input
          icon={<Mail />}
          name='email'
          type='email'
          placeholder='Email...'
          required
        />
        <Sublabel>
          Please provide a valid email address we can send a verification link to.
        </Sublabel>
      </div>
      <div className='flex gap-2 w-full'>
        <button
          onClick={() => router.push('/')}
          className='--outlined --secondary --full-width'
          type='button'>
          Cancel
        </button>
        <SubmitButton
          loading={isEmailPending}
          disabled={isEmailPending || emailStatus === 'success'}>
          Send Link
        </SubmitButton>
      </div>
      <EmailStatusNotice status={emailStatus} />
    </>
  );
}

const EmailStatusNotice = ({ status }) => {
  return status === AuthError.duplicateEmail ? (
    <Notice variant='error'>A user with the provided email already exists!</Notice>
  ) : status === AuthError.emailInvalidDomain ? (
    <Notice variant='error'>Only gmail is allowed!</Notice>
  ) : status === 'success' ? (
    <Notice variant='success'>Email sent successfully! Please check your inbox.</Notice>
  ) : status === 'error' ? (
    <Notice variant='error'>An unexpected error occured!</Notice>
  ) : null;
};

function StepTwo() {
  const { isCredentialsPending, credentialsStatus, token } = useRegisterFormContext();
  const router = useRouter();

  return (
    <>
      <input
        name='token'
        hidden
        value={token}
      />
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
          loading={isCredentialsPending}
          disabled={isCredentialsPending || credentialsStatus === 'success'}>
          Register
        </SubmitButton>
      </div>
      <CredentialsStatusNotice status={credentialsStatus} />
    </>
  );
}

const CredentialsStatusNotice = ({ status }) => {
  return status === AuthError.passwordInvalidFormat ? (
    <Notice variant='error'>Password must contain numbers, letters and special characters!</Notice>
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
  ) : null;
};

const SubmitButton = withLoader(({ children, ...props }: React.ComponentProps<'button'>) => (
  <button
    {...props}
    className='--contained --accent --full-width'
    type='submit'>
    {children}
  </button>
));
