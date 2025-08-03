import { UserInterestTagInput } from '@/components/UserInterestTagInput';
import { loadSession } from '@/util/loadSession';

export default async function UserPage({ searchParams }) {
  const session = await loadSession();

  return (
    <div className='flex flex-col flex-1 items-start w-full p-2'>
      <div className='w-full flex flex-col gap-2'>
        <h3>Mielenkiinnon kohteet</h3>
        <UserInterestTagInput />
      </div>
    </div>
  );
}
