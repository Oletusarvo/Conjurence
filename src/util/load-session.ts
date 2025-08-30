import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

/**Loads the current session, as it is on the server. Redirects to the login-page if no session is found. */
export async function loadSession({ callbackUrl }: { callbackUrl?: string } = {}) {
  const session = (await getServerSession(options)) as any;

  if (!session) {
    return redirect(`/login?callback_url=${callbackUrl}`);
  }
  return session;
}
