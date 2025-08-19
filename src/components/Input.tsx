import React, { ReactNode } from 'react';

type InputProps = React.ComponentProps<'input'> & {
  icon?: ReactNode;
};
export function Input({ icon, ...props }: InputProps) {
  const inputClassName = ['py-2 bg-background-light', icon ? 'pl-10 pr-4' : 'px-4'].join(' ');

  return (
    <div className='relative w-full flex items-center'>
      <span className='absolute left-2 text-gray-500'>{icon}</span>
      <input
        {...props}
        className={inputClassName}
      />
    </div>
  );
}
