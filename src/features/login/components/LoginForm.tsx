'use client';

import { Ellipsis, Mail } from 'lucide-react';
import { Input } from '../../../components/Input';
import { hideIf } from '@/util/rendering/hideIf';
import { AuthError } from '@/errors/auth';
import { Sublabel } from '../../../components/Sublabel';
import { withLoader } from '@/hoc/withLoader';
import { useLoginForm } from '../hooks/useLoginForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Notice } from '@/components/Notice';

export function LoginForm() {
  const { status, isPending, submitCredentials } = useLoginForm();
  const router = useRouter();

  const SubmitButton = withLoader(({ children, ...props }: React.ComponentProps<'button'>) => (
    <button
      {...props}
      className='--contained --accent --full-width'
      type='submit'>
      {children}
    </button>
  ));

  return (
    <form
      className='flex flex-col gap-2 sm:w-[450px] xs:w-full h-full justify-center'
      onSubmit={submitCredentials}>
      <Input
        icon={<Mail />}
        name='email'
        placeholder='Email...'
        required
      />
      <div className='form-input-group'>
        <div className='w-full flex justify-end'>
          <Link
            href='/login/reset'
            className='text-accent'>
            Forgot Password?
          </Link>
        </div>

        <Input
          icon={<Ellipsis />}
          name='password'
          type='password'
          placeholder='Password...'
          required
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
          disabled={isPending || status === 'success'}>
          Login
        </SubmitButton>
      </div>
      <StatusNotice status={status} />
    </form>
  );
}

function StatusNotice({ status }) {
  return status === AuthError.invalidCredentials ? (
    <Notice variant='error'>Invalid credentials!</Notice>
  ) : status === 'error' ? (
    <Notice variant='error'>An unexpected error occured!</Notice>
  ) : status === 'success' ? (
    <Notice variant='success'>Login successful! You will be redirected to the event feed...</Notice>
  ) : null;
}
