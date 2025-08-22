'use client';

import { CheckboxInput } from '@/components/CheckboxInput';
import { useCreateEventFormContext } from '../CreateEventForm';
import { useUserContext } from '@/features/users/providers/UserProvider';

export function IsTemplateCheckbox() {
  const { user } = useUserContext();
  const { handleChange, payload } = useCreateEventFormContext();
  return (
    <CheckboxInput
      onChange={handleChange}
      type='checkbox'
      name='is_template'
      checked={payload.get('is_template') == 'true'}
      hidden={!user.subscription.allow_templates}
      label={<span>Save event as template?</span>}
      component={props => <input {...props} />}
    />
  );
}
