import { withIcon } from '@/hoc/withIcon';
import { AtSign } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const ContainerLink = ({
  children,
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Link> & { icon: typeof AtSign }) => {
  const Component = withIcon(Link);
  return (
    <Component
      {...props}
      icon={
        <Icon
          size='36px'
          color='var(--color-accent)'
        />
      }
      className='container-link w-full flex items-center'>
      <div className='flex flex-col flex-1 gap-2'>{children}</div>
    </Component>
  );
};
