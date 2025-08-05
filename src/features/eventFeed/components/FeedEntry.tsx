import { UsernameContainer } from './UsernameContainer';

type FeedEntryProps = React.PropsWithChildren & {
  username: string;
  timestamp: string;
};

export function FeedEntry({ children, username, timestamp }: FeedEntryProps) {
  return (
    <div className='w-full flex justify-between items-center text-sm'>
      <div className='flex items-center gap-2 flex-1'>
        <UsernameContainer>{username}</UsernameContainer>
      </div>
      <div className='flex-1'>{children}</div>

      <div className='flex-1 justify-end flex'>
        <span>{timestamp}</span>
      </div>
    </div>
  );
}
