import { ReactNode } from 'react';
import { Modal, ModalProps } from './Modal';

export function Dialog({
  children,
  title,
  cancelButton,
  confirmButton,
}: Omit<ModalProps, 'show'> & { confirmButton?: ReactNode; cancelButton?: ReactNode }) {
  return (
    <Modal
      title={title}
      show={true}>
      <div className='flex flex-col w-full gap-4'>
        {children}
        <div className='flex gap-2 w-full'>
          {cancelButton}
          {confirmButton}
        </div>
      </div>
    </Modal>
  );
}
