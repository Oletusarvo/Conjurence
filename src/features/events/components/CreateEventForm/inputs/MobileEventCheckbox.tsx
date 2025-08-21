'use client';

import { CheckboxInput } from '@/components/CheckboxInput';
import { useCreateEventFormContext } from '../CreateEventForm';
import { useUserContext } from '@/features/users/providers/UserProvider';

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
