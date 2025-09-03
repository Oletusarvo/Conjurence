'use client';

import { ToggleProvider } from '@/providers/toggle-provider';
import { RoundButton } from './ui/round-button';
import { Modal } from './modal-temp';

export function TestModalButton() {
  return (
    <ToggleProvider>
      <ToggleProvider.Trigger>
        <RoundButton>M</RoundButton>
      </ToggleProvider.Trigger>
      <ToggleProvider.Target>
        <Modal
          title='nonii-i'
          show={true}
          fullHeight>
          Kaljaa
        </Modal>
      </ToggleProvider.Target>
    </ToggleProvider>
  );
}
