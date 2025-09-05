'use client';

import { ReactNode } from 'react';
import { Modal, ModalProps } from './modal-temp';

export function Dialog({
  children,
  title,
  cancelButton,
  confirmButton,
  ...props
}: Omit<ModalProps, 'show'> & { confirmButton?: ReactNode; cancelButton?: ReactNode }) {
  return (
    <Modal
      {...props}
      title={title}
      show={true}>
      <div className='flex flex-col w-full gap-4 p-4'>
        {children}
        <div className='flex gap-2 w-full'>
          {cancelButton}
          {confirmButton}
        </div>
      </div>
    </Modal>
  );
}
