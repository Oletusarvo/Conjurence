'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { ReactNode, SetStateAction, useState } from 'react';

const [ModalStackContext, useModalStackContext] = createContextWithUseHook<{
  setModal: React.Dispatch<SetStateAction<ReactNode>>;
  closeModal: () => void;
}>('useModalStackContext can only be called within the scope of a ModalStackContext!');

export function ModalStackProvider({ children }) {
  const [modal, setModal] = useState<ReactNode[]>([]);

  const closeModal = () => {
    setModal(null);
  };

  return (
    <ModalStackContext.Provider value={{ setModal, closeModal }}>
      {children}
      {modal}
    </ModalStackContext.Provider>
  );
}

export { useModalStackContext };
