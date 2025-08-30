'use client';

import { CheckboxInput } from '@/components/checkbox-input';
import { useCreateEventFormContext } from '../create-event-form';
import { useUserContext } from '@/features/users/providers/user-provider';

export function MobileEventCheckbox() {
  const { user } = useUserContext();
  const { payload, handleChange } = useCreateEventFormContext();

  return (
    <CheckboxInput
      hidden={!user.subscription.allow_mobile_events}
      label={<span>Mobile event?</span>}
      type='checkbox'
      name='is_mobile'
      onChange={handleChange}
      checked={payload.get('is_mobile') == 'true'}
      component={props => <input {...props} />}
    />
  );
}
