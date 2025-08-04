'use client';

import { Modal } from '@/components/Modal';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { ReactNode, useState } from 'react';

type ButtonConfigProps = { props?: React.ComponentProps<'button'>; content: ReactNode };

type ModalConfig = {
  title: string;
  content: ReactNode;
  confirmButtonConfig: ButtonConfigProps;
  cancelButtonConfig: ButtonConfigProps;
};

const [ModalStackContext, useModalStackContext] = createContextWithUseHook<{
  pushModal: (config: ModalConfig) => void;
  closeCurrentModal: () => void;
}>('useModalStackContext can only be called within the scope of a ModalStackContext!');

export function ModalStackProvider({ children }) {
  const [modals, setModals] = useState<ModalConfig[]>([]);
  const pushModal = (config: ModalConfig) => {
    setModals([...modals, config]);
  };

  const currentModal = modals.at(-1);

  const closeCurrentModal = () => {
    setModals(prev => {
      const current = [...prev];
      current.pop();
      return current;
    });
  };

  return (
    <ModalStackContext.Provider value={{ pushModal, closeCurrentModal }}>
      {children}
      {currentModal ? (
        <Modal
          show={!!currentModal}
          title={currentModal.title}>
          <div className='flex flex-col w-full gap-4'>
            {currentModal.content}
            <div className='flex gap-2 w-full'>
              <button
                {...currentModal.cancelButtonConfig.props}
                onClick={e => {
                  const { onClick } = currentModal.cancelButtonConfig?.props || {};
                  if (onClick) {
                    onClick(e);
                  }
                  closeCurrentModal();
                }}>
                {currentModal.cancelButtonConfig.content}
              </button>
              <button
                {...currentModal.confirmButtonConfig.props}
                onClick={e => {
                  const { onClick } = currentModal.confirmButtonConfig?.props || {};
                  if (onClick) {
                    onClick(e);
                  }
                }}>
                {currentModal.confirmButtonConfig.content}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </ModalStackContext.Provider>
  );
}

export { useModalStackContext };
