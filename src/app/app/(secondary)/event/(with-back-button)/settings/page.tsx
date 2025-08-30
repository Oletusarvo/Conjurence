import { UserInterestTagInput } from '@/components/user-interest-tag-input';

export default async function SettingsPage() {
  return (
    <div className='flex flex-col w-full flex-1 px-default py-2'>
      <h2>Settings</h2>
      <UserInterestTagInput />
    </div>
  );
}
