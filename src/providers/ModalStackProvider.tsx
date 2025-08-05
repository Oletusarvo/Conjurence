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
  pushModal: (config: ReactNode) => void;
  closeCurrentModal: () => void;
}>('useModalStackContext can only be called within the scope of a ModalStackContext!');

export function ModalStackProvider({ children }) {
  const [modals, setModals] = useState<ReactNode[]>([]);
  const pushModal = (config: ReactNode) => {
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
      {currentModal}
    </ModalStackContext.Provider>
  );
}

export { useModalStackContext };
