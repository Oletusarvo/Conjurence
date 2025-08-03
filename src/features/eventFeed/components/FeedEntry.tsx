import { UsernameContainer } from './UsernameContainer';

type FeedEntryProps = React.PropsWithChildren & {
  username: string;
  timestamp: string;
};

export function FeedEntry({ children, username, timestamp }: FeedEntryProps) {
  return (
    <div className='w-full flex justify-between items-center text-sm'>
      <div className='flex items-center gap-2'>
        <UsernameContainer>{username}</UsernameContainer>
        {children}
      </div>

      <span>{timestamp}</span>
    </div>
  );
}
