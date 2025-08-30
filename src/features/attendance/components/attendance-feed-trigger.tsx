'use client';

import { Modal } from '@/components/modal-temp';
import { InterestedCountBadge } from '@/features/attendance/components/interested-count-badge';
import { ToggleProvider } from '@/providers/toggle-provider';
import { JoinedCountBadge } from './joined-count-badge';
import { X } from 'lucide-react';

/**Renders the trigger containing the current interest- and attendance count on an event. Displays the AttendanceFeed once clicked/tapped. */
export function AttendanceFeedTrigger({ children }) {
  return (
    <ToggleProvider>
      <ToggleProvider.Trigger>
        <div className='flex gap-4'>
          <InterestedCountBadge />
          <JoinedCountBadge />
        </div>
      </ToggleProvider.Trigger>
      <ToggleProvider.Target useProps>
        <AttendanceModal>{children}</AttendanceModal>
      </ToggleProvider.Target>
    </ToggleProvider>
  );
}

function AttendanceModal({ children, ...props }) {
  const { isToggled } = props;
  return (
    <div
      className='flex flex-col gap-2 w-full h-full z-30 absolute top-0 left-0 bg-[#0005] backdrop-blur-md px-default py-4'
      hidden={!isToggled}>
      <div className='flex items-center w-full justify-between mb-4'>
        <h3>Attendants</h3>
        <ToggleProvider.Trigger>
          <button className='--no-default'>
            <X />
          </button>
        </ToggleProvider.Trigger>
      </div>

      {children}
    </div>
  );
}
