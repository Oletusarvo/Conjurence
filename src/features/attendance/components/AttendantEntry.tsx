import { UsernameContainer } from './UsernameContainer';

type AttendantEntryProps = React.PropsWithChildren & {
  username: string;
  timestamp: string;
};

export function AttendantEntry({ children, username, timestamp }: AttendantEntryProps) {
  return (
    <div className='w-full flex justify-between items-center text-sm'>
      <div className='flex items-center gap-2 flex-1'>
        <UsernameContainer>{username}</UsernameContainer>
      </div>

      <div className='flex-1 justify-end flex gap-2'>
        {children}
        <span>{timestamp}</span>
      </div>
    </div>
  );
}
