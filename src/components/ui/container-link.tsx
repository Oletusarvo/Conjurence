import { withIcon } from '@/hoc/with-icon';
import { AtSign } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

/**Renders the links for selecting whether to create a new event or one from a template. Is also used as the links for selecting the templates from the template-list.*/
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
