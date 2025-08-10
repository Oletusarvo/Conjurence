import { FormContainer } from '@/components/Form';
import { RegisterForm } from '@/features/signup/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className='flex gap-2 flex-col flex-1 justify-center px-default items-center'>
      <FormContainer>
        <h2>Register</h2>
        <RegisterForm />
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
