'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner-temp';

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    signOut({
      callbackUrl: '/',
    });
  }, []);

  return (
    <div className='flex-1 flex flex-col items-center justify-center'>
      <div className='flex gap-2 items-center'>
        <Spinner /> <span>Logging out...</span>
      </div>
    </div>
  );
}
