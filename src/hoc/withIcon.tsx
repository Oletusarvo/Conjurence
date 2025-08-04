import { ReactNode } from 'react';

export function withIcon<CT extends (props: any) => ReactNode>(Component: CT) {
  return ({ children, icon, ...props }: any) => {
    return (
      <Component {...props}>
        <div className='flex items-center gap-2'>
          {icon}
          {children}
        </div>
      </Component>
    );
  };
}
