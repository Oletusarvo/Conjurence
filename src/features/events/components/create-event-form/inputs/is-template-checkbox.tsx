'use client';

import { CheckboxInput } from '@/components/checkbox-input';
import { useCreateEventFormContext } from '../create-event-form';
import { useUserContext } from '@/features/users/providers/user-provider';

export function IsTemplateCheckbox() {
  const { user } = useUserContext();
  return (
    <CheckboxInput
      type='checkbox'
      name='is_template'
      hidden={!user.subscription.allow_templates}
      label={<span>Save event as template?</span>}
      component={props => <input {...props} />}
    />
  );
}
