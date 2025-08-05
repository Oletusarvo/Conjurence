import { AtSign } from 'lucide-react';

export function UsernameContainer({ children }: React.PropsWithChildren) {
  return (
    <div
      className='p-1 text-white border border-accent flex items-center rounded-md gap-1 max-w-full overflow-hidden text-ellipsis text-nowrap'
      style={{
        backgroundColor: 'hsl(from var(--color-accent) h s l / 0.2)',
      }}>
      <AtSign size='12px' />
      {children}
    </div>
  );
}
