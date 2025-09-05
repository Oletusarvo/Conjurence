'use client';

import { Modal } from '@/components/modal-temp';
import { ToggleProvider } from '@/providers/toggle-provider';
import { X } from 'lucide-react';

/**Renders the trigger containing the current interest- and attendance count on an event. Displays the AttendanceFeed once clicked/tapped. */
export function AttendanceFeedTrigger({ children }) {
  return (
    <ToggleProvider.Trigger>
      <div className='flex gap-4'>{children}</div>
    </ToggleProvider.Trigger>
  );
}

export function AttendanceFeedTarget({ children }) {
  return (
    <ToggleProvider.Target useProps>
      <AttendanceModal>{children}</AttendanceModal>
    </ToggleProvider.Target>
  );
}

function AttendanceModal({ children, ...props }) {
  const { isToggled } = props;
  return (
    <Modal
      fullHeight
      show={isToggled}
      title='Attendants'>
      <div className='flex flex-col gap-2 w-full h-full px-default'>
        <div className='flex flex-col w-full flex-1 gap-2 max-h-full overflow-y-scroll'>
          {children}
        </div>
      </div>
    </Modal>
  );
}
