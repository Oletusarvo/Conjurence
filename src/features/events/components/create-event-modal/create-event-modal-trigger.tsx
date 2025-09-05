'use client';

import { RoundButton } from '@/components/ui/round-button';
import { useModalStackContext } from '@/providers/modal-stack-provider';
import { Plus } from 'lucide-react';
import { CreateEventModal } from './create-event-modal';

export function AddEventModalTrigger() {
  const { setModal } = useModalStackContext();
  return (
    <RoundButton onClick={() => setModal(<CreateEventModal />)}>
      <Plus />
    </RoundButton>
  );
}
