import { withIcon } from '@/hoc/withIcon';
import { AtSign } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const ContainerLink = ({
  children,
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Link> & { icon: typeof AtSign }) => {
  return (
    <Link
      {...props}
      className='container-link w-full'>
      <div className='flex items-center'>
        <Icon
          size='var(--text-4xl)'
          color='var(--color-accent)'
        />
      </div>
      <div className='flex flex-col flex-1 gap-2'>{children}</div>
    </Link>
  );
};
