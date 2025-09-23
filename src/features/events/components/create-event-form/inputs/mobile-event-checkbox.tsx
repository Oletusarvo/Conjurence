'use client';

import { CheckboxInput } from '@/components/checkbox-input';
import { useCreateEventFormContext } from '../create-event-form';
import { useUserContext } from '@/features/users/providers/user-provider';

export function MobileEventCheckbox() {
  const { user } = useUserContext();
  const { template } = useCreateEventFormContext();
  return (
    <CheckboxInput
      //defaultChecked={template?.is_mobile}
      hidden={!user?.subscription.allow_mobile_events}
      label={<span>Mobile event?</span>}
      type='checkbox'
      name='is_mobile'
      component={props => <input {...props} />}
    />
  );
}
