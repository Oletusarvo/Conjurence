import { useUserContext } from '@/features/users/providers/UserProvider';
import { useCreateEventFormContext } from './CreateEventForm';
import { eventDescriptionSchema } from '../../schemas/eventSchema';
import { EventError } from '@/errors/events';
import { Sublabel } from '@/components/ui/Sublabel';
import { CheckboxInput } from '@/components/CheckboxInput';
import { DescriptionInput } from './inputs/DescriptionInput';

export function DescriptionStep() {
  const { user } = useUserContext();
  const { handleChange, template, payload, inputStatus } = useCreateEventFormContext();
  return (
    <>
      <DescriptionInput />
    </>
  );
}
