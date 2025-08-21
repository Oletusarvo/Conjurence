'use client';

import { useClassName } from '@/hooks/useClassName';
import { ToggleProvider } from '@/providers/ToggleProvider';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export type ModalProps = React.PropsWithChildren & {
  title: string;
  onClose?: () => void;
  show: boolean;
  fullHeight?: boolean;
};

export function Modal({ children, title, onClose, show, fullHeight, ...props }: ModalProps) {
  const ref = useRef(null);

  const hideOnClickOutside = e => {
    if (onClose && ref.current && !ref.current.contains(e.target)) {
      onClose();
    }
  };

  const bodyClassName = useClassName(
    'p-4 overflow-hidden w-full flex flex-col animate-slide-down bg-[#0009] px-default',
    fullHeight ? 'h-full' : ''
  );

  useEffect(() => {
    document.addEventListener('mousedown', hideOnClickOutside);
    return () => document.removeEventListener('mousedown', hideOnClickOutside);
  }, []);

  return show ? (
    <div className='flex w-full h-screen absolute top-0 left-0 items-center justify-center backdrop-blur-md z-40'>
      <div
        {...props}
        //ref={ref}
        className={bodyClassName}>
        <div className='w-full flex items-center justify-between mb-4 py-2 z-10'>
          <h3>{title}</h3>

          {onClose ? (
            <button
              className='--no-default'
              onClick={() => onClose && onClose()}>
              <X />
            </button>
          ) : null}
        </div>

        {children}
      </div>
    </div>
  ) : null;
}
