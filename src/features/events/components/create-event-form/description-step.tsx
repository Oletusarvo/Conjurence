import { useUserContext } from '@/features/users/providers/user-provider';
import { useCreateEventFormContext } from './create-event-form';
import { eventDescriptionSchema } from '../../schemas/event-schema';
import { EventError } from '@/errors/events';
import { Sublabel } from '@/components/ui/sub-label';
import { CheckboxInput } from '@/components/checkbox-input';
import { DescriptionInput } from './inputs/description-input';

export function DescriptionStep() {
  const { user } = useUserContext();
  const { handleChange, template, payload, inputStatus } = useCreateEventFormContext();
  return (
    <>
      <DescriptionInput />
    </>
  );
}
