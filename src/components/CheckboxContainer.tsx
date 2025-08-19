'use client';

import { useClassName } from '@/hooks/useClassName';
import { ReactNode, useEffect, useRef, useState } from 'react';

type CheckboxContainerProps = React.ComponentProps<'input'> & {
  label: ReactNode;
  component: (props: React.ComponentProps<'input'>) => ReactNode;
};
export function CheckboxContainer({
  label,
  component: Component,
  checked,
  hidden,
  ...props
}: CheckboxContainerProps) {
  const componentRef = useRef<HTMLInputElement>(null);
  return (
    <div
      hidden={hidden}
      onClick={e => {
        if (e.target === componentRef.current) return; // ignore clicks directly on checkbox
        componentRef.current?.click();
      }}
      className={
        'w-full p-2 rounded-md flex items-center justify-between text-gray-300 cursor-pointer'
      }
      style={{
        borderWidth: '1px',
        borderColor: checked ? 'var(--color-accent)' : 'var(--color-background-light-border)',
        backgroundColor: checked
          ? 'hsl(from var(--color-accent) h s l / 0.2)'
          : 'var(--color-background-light)',
      }}>
      {label}
      <Component
        {...props}
        ref={componentRef}
        checked={checked}
      />
    </div>
  );
}
