import { loadSession } from '@/util/load-session';

export default async function UserPage() {
  const session = await loadSession();

  return (
    <div className='flex flex-1 flex-col w-full'>
      <h3>{session.user.username}</h3>
    </div>
  );
}
