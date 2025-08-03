import { LoginForm } from '@/features/login/components/LoginForm';

export default async function LoginPage() {
  return (
    <div className='flex flex-col gap-2 flex-1 w-full justify-center'>
      <h2>Login</h2>
      <LoginForm />
    </div>
  );
}
