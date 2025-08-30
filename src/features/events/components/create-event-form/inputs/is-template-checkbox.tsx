'use client';

import { CheckboxInput } from '@/components/checkbox-input';
import { useCreateEventFormContext } from '../create-event-form';
import { useUserContext } from '@/features/users/providers/user-provider';

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
