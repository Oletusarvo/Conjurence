'use client';

import { Ellipsis, Mail } from 'lucide-react';
import { Input } from '../../../components/Input';
import { hideIf } from '@/util/rendering/hideIf';
import { AuthError } from '@/errors/auth';
import { Sublabel } from '../../../components/Sublabel';
import { withLoader } from '@/hoc/withLoader';
import { useLoginForm } from '../hooks/useLoginForm';

export function LoginForm() {
  const { status, isPending, submitCredentials } = useLoginForm();

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
      className='flex flex-col gap-2 sm:w-[450px] xs:w-full'
      onSubmit={submitCredentials}>
      <Input
        icon={<Mail />}
        name='email'
        placeholder='Email...'
        required
      />
      <div className='form-input-group'>
        <Input
          icon={<Ellipsis />}
          name='password'
          type='password'
          placeholder='Password...'
          required
        />
        {hideIf(
          status === AuthError.invalidCredentials ? (
            <Sublabel variant='error'>Invalid credentials!</Sublabel>
          ) : null,
          isPending
        )}
      </div>
      <div className='flex gap-2 w-full'>
        <button
          className='--outlined --accent --full-width'
          type='button'>
          Cancel
        </button>

        <SubmitButton
          loading={isPending}
          disabled={isPending || status === 'success'}>
          Login
        </SubmitButton>
      </div>
    </form>
  );
}
