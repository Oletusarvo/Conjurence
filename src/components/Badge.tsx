import { createClassName } from '@/util/createClassName';
import { ReactNode } from 'react';

type BadgeProps = React.PropsWithChildren & {
  icon: (props) => ReactNode;
  textSize?: 'small' | 'normal';
};

export function Badge({ children, textSize = 'normal', icon: Icon }: BadgeProps) {
  const className = createClassName(
    'flex gap-2 items-center',
    textSize === 'small' ? 'text-sm' : ''
  );
  return (
    <div className={className}>
      <Icon size={'14px'} />
      <span>{children}</span>
    </div>
  );
}
