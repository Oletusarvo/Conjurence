import { AtSign } from 'lucide-react';
import Link from 'next/link';

export const ContainerLink = ({
  children,
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Link> & { icon: typeof AtSign }) => {
  return (
    <Link
      {...props}
      className='flex w-full rounded-xl p-4 bg-background-light gap-4 hover:bg-[hsl(from var(--color-accent) h s 1.1)] border border-accent'
      style={{
        backgroundColor: 'hsl(from var(--color-accent) h s l / 0.2)',
      }}>
      <div className='flex items-center'>
        <Icon
          size='var(--text-4xl)'
          color='var(--color-yellow-200)'
        />
      </div>
      <div className='flex flex-col flex-1'>{children}</div>
    </Link>
  );
};
