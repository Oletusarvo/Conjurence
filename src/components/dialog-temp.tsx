'use client';

import { ReactNode, useMemo } from 'react';
import { Modal, ModalProps } from './modal-temp';
import { ToggleProvider } from '@/providers/toggle-provider';
import React from 'react';

export function Dialog({
  children,
  title,
  ...props
}: Omit<ModalProps, 'show'> & { confirmButton?: ReactNode; cancelButton?: ReactNode }) {
  const childArray = useMemo(() => React.Children.toArray(children), [children]);
  const confirmButton = childArray.find((c: any) => c.type === Dialog.ConfirmButton);
  const cancelButton = childArray.find((c: any) => c.type === Dialog.CancelButton);
  const content = childArray.find((c: any) => c.type === Dialog.Content);

  return (
    <Modal
      {...props}
      title={title}
      show={true}>
      <div className='flex flex-col w-full gap-4 p-4'>
        {content}
        <div className='flex gap-2 w-full'>
          {cancelButton}
          {confirmButton}
        </div>
      </div>
    </Modal>
  );
}

Dialog.ConfirmButton = function ({
  children,
  action,
}: React.PropsWithChildren & { action?: () => Promise<void> }) {
  return <ToggleProvider.Trigger action={action}>{children}</ToggleProvider.Trigger>;
};

Dialog.CancelButton = function ({ children }: React.PropsWithChildren) {
  return <ToggleProvider.Trigger>{children}</ToggleProvider.Trigger>;
};

Dialog.Content = function ({ children }: React.PropsWithChildren) {
  return children;
};
