'use client';

import { ToggleProvider } from '@/providers/toggle-provider';
import { Dialog } from '../dialog-temp';
import { useState } from 'react';
import { LoaderButton } from '../ui/loader-button';

/**Displays a conformation dialog. Must be used within the scope of a ToggleProvider. */
export function ConfirmDialog({
  children,
  title,
  confirmContent,
  cancelContent,
  action,
  ...props
}) {
  const [isPending, setIsPending] = useState(false);

  const ConfirmButton = ({ children, ...props }: React.ComponentProps<typeof LoaderButton>) => (
    <LoaderButton
      {...props}
      className='--contained --accent --full-width'>
      {children}
    </LoaderButton>
  );

  return (
    <Dialog
      {...props}
      title={title}
      cancelButton={
        <ToggleProvider.Trigger>
          <button
            className='--outlined --accent --full-width'
            disabled={isPending}>
            {cancelContent}
          </button>
        </ToggleProvider.Trigger>
      }
      confirmButton={
        <ToggleProvider.Trigger
          action={async () => {
            setIsPending(true);
            await action();
            setIsPending(false);
          }}>
          <ConfirmButton
            disabled={isPending}
            loading={isPending}>
            {confirmContent}
          </ConfirmButton>
        </ToggleProvider.Trigger>
      }>
      <p>{children}</p>
    </Dialog>
  );
}
