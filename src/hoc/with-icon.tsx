import { ReactNode } from 'react';

export function withIcon<CT extends (props: any) => ReactNode>(Component: CT) {
  return ({ children, icon, ...props }: any) => {
    return (
      <Component {...props}>
        <div className='flex gap-1 items-center'>
          {icon}
          {children}
        </div>
      </Component>
    );
  };
}
