'use client';

import { ConfirmDialog } from '@/components/feature/confirm-dialog';
import { Modal } from '@/components/modal-temp';
import { UserInterestTagInput } from '@/components/user-interest-tag-input';
import { deleteUserAction } from '@/features/users/actions/deleteUserAction';
import { withIcon } from '@/hoc/with-icon';
import { ToggleProvider } from '@/providers/toggle-provider';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const Trigger = withIcon(({ children, ...props }) => (
    <div
      {...props}
      className='flex items-center gap-4 cursor-pointer'>
      {children}
    </div>
  ));
  return (
    <div className='flex flex-col w-full flex-1 px-default py-2 gap-4'>
      <h2>Settings</h2>
      <ToggleProvider>
        <ToggleProvider.Trigger>
          <Trigger icon={<Trash />}>Delete account</Trigger>
        </ToggleProvider.Trigger>

        <ToggleProvider.Target>
          <ConfirmDialog
            title={'Delete account'}
            cancelContent={'Cancel'}
            confirmContent={'Delete'}
            action={async () => {
              //setLoading(true);
              try {
                const res = await deleteUserAction();
                if (!res.success) {
                  toast.error('Account deletion failed!');
                } else {
                  toast.success('Account deleted!');
                  router.push('/logout');
                }
              } finally {
                //setLoading(false);
              }
            }}>
            You are about to delete your account - This cannot be undone. Are you sure you wish to
            continue?
          </ConfirmDialog>
        </ToggleProvider.Target>
      </ToggleProvider>
    </div>
  );
}
