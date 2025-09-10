'use client';

import { useClassName } from '@/hooks/use-class-name';
import { ReactNode, useEffect, useRef, useState } from 'react';

type CheckboxInputProps = React.ComponentProps<'input'> & {
  label: ReactNode;
  component: (props: React.ComponentProps<'input'>) => ReactNode;
};
export function CheckboxInput({
  label,
  component: Component,
  checked,
  hidden,
  ...props
}: CheckboxInputProps) {
  const [isChecked, setIsChecked] = useState(checked || false);
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
        borderColor: isChecked ? 'var(--color-accent)' : 'var(--color-background-light-border)',
        backgroundColor: isChecked
          ? 'hsl(from var(--color-accent) h s l / 0.2)'
          : 'var(--color-background-light)',
      }}>
      {label}
      <Component
        {...props}
        onChange={e => {
          if (props.onChange) {
            props.onChange(e);
          }
          setIsChecked(e.target.checked);
        }}
        ref={componentRef}
        checked={isChecked}
      />
    </div>
  );
}
