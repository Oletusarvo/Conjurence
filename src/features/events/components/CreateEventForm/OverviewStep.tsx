import { CheckboxInput } from '@/components/CheckboxInput';
import { Input } from '@/components/Input';
import { Sublabel } from '@/components/Sublabel';
import { EventError } from '@/errors/events';
import { Armchair, Heading, Pin } from 'lucide-react';
import { eventLocationTitleSchema, eventTitleSchema } from '../../schemas/eventSchema';
import { useCreateEventFormContext } from './CreateEventForm';
import { useUserContext } from '@/features/users/providers/UserProvider';

export function OverviewStep() {
  const { user } = useUserContext();
  const { payload, template, handleChange, inputStatus } = useCreateEventFormContext();

  return (
    <>
      <div className='form-input-group'>
        <Input
          autoComplete='off'
          onChange={e => {
            handleChange(e, eventTitleSchema);
          }}
          icon={<Heading />}
          name='title'
          placeholder='Title...'
          required
          defaultValue={template?.title || payload.get('title')?.toString()}
        />
        {inputStatus.title === EventError.titleTooShort ? (
          <Sublabel variant='error'>The title is too short!</Sublabel>
        ) : inputStatus.title === EventError.titleTooLong ? (
          <Sublabel variant='error'>The title is too long!</Sublabel>
        ) : null}
      </div>

      <div className='form-input-group'>
        <Input
          autoComplete='off'
          onChange={e => {
            handleChange(e, eventLocationTitleSchema);
          }}
          icon={<Pin />}
          name='location_title'
          placeholder='Location title...'
          required
          defaultValue={template?.location_title || payload.get('location_title')?.toString()}
        />
        {inputStatus.location_title === EventError.locationTooShort ? (
          <Sublabel variant='error'>The location is too short!</Sublabel>
        ) : inputStatus.location_title === EventError.locationTooLong ? (
          <Sublabel variant='error'>The location is too long!</Sublabel>
        ) : null}
      </div>

      <Input
        min={1}
        onChange={e => handleChange(e)}
        icon={<Armchair />}
        name='spots_available'
        placeholder='Spots available...'
        type='number'
        defaultValue={template?.spots_available || payload.get('spots_available')?.toString()}
      />

      <CheckboxInput
        hidden={!user.subscription.allow_mobile_events}
        label={<span>Mobile event?</span>}
        type='checkbox'
        name='is_mobile'
        onChange={handleChange}
        checked={payload.get('is_mobile') == 'true'}
        component={props => <input {...props} />}
      />
    </>
  );
}
