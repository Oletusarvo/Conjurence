import { createClassName } from '@/util/createClassName';
import { ReactNode } from 'react';

export type BadgeProps = React.PropsWithChildren & {
  icon: (props) => ReactNode;
  textSize?: 'small' | 'normal';
};

/**Renders its children with an icon side-by-side. */
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
