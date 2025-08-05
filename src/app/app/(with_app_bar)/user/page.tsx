import { Input } from '@/components/Input';
import { UserInterestTagInput } from '@/components/UserInterestTagInput';
import { loadSession } from '@/util/loadSession';
import { AtSign, Mail } from 'lucide-react';

export default async function UserPage({ searchParams }) {
  const session = await loadSession();

  return (
    <div className='flex flex-col flex-1 items-start w-full p-2'>
      <section className='flex gap-1 py-8'>
        <AtSign />
        <h2>{session.user.username}</h2>
      </section>

      <section className='flex-1 w-full flex flex-col gap-4 py-8'>
        <h2>Profiili</h2>
        <div className='flex flex-col'>
          <label>Bio</label>
          <textarea
            className='w-full rounded-lg border border-gray-600 bg-background-light resize-none py-2 px-4'
            placeholder='Bio...'
            spellCheck={false}
          />
        </div>

        <div className='w-full flex flex-col gap-2'>
          <label>Kiintymykset</label>
          <UserInterestTagInput />
        </div>
      </section>

      <section className='w-full flex flex-col gap-2 flex-1 py-8'>
        <label>Asetukset</label>
        <Input
          icon={<AtSign />}
          defaultValue={session.user.username}
          placeholder='Käyttäjätunnus...'
        />
        <Input
          icon={<Mail />}
          defaultValue={session.user.email}
          placeholder='Sähköpostiosoite...'
        />
      </section>
    </div>
  );
}
