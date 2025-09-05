import { useUserContext } from '@/features/users/providers/user-provider';
import { useCreateEventFormContext } from './create-event-form';
import { DescriptionInput } from './inputs/description-input';

export function DescriptionStep() {
  return (
    <>
      <DescriptionInput />
    </>
  );
}
