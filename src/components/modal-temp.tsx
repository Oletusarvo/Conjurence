'use client';

import { useClassName } from '@/hooks/use-class-name';
import { ToggleProvider } from '@/providers/toggle-provider';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export type ModalProps = React.PropsWithChildren & {
  title: string;
  onClose?: () => void;
  show: boolean;
  closeable?: boolean;
  fullHeight?: boolean;
};

export function Modal({
  children,
  title,
  onClose,
  show,
  fullHeight,
  closeable = true,
  ...props
}: ModalProps) {
  const ref = useRef(null);

  const hideOnClickOutside = e => {
    if (onClose && ref.current && !ref.current.contains(e.target)) {
      onClose();
    }
  };

  const bodyClassName = useClassName(
    'overflow-hidden w-full flex flex-col animate-slide-down bg-modal-background rounded-lg shadow-md',
    fullHeight ? 'h-full' : ''
  );

  useEffect(() => {
    document.addEventListener('mousedown', hideOnClickOutside);
    return () => document.removeEventListener('mousedown', hideOnClickOutside);
  }, []);

  const closeButton = (
    <button
      className='--ghost --round'
      onClick={() => onClose && onClose()}>
      <X />
    </button>
  );

  return show ? (
    <div className='flex w-full h-screen absolute top-0 left-0 items-center justify-center backdrop-blur-md z-90 p-1'>
      <div
        {...props}
        //ref={ref}
        className={bodyClassName}>
        <div className='w-full flex items-center justify-between mb-4 py-2 z-10 px-default'>
          <h3>{title}</h3>

          {closeable ? (
            onClose ? (
              closeButton
            ) : (
              <ToggleProvider.Trigger>{closeButton}</ToggleProvider.Trigger>
            )
          ) : null}
        </div>

        {children}
      </div>
    </div>
  ) : null;
}
