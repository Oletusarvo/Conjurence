import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function loadSession({ callbackUrl }: { callbackUrl?: string } = {}) {
  const session = (await getServerSession(options)) as any;

  if (!session) {
    return redirect(`/login?callback_url=${callbackUrl}`);
  }
  return session;
}
