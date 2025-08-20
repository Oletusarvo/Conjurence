import { useUserContext } from '@/features/users/providers/UserProvider';
import { useCreateEventFormContext } from './CreateEventForm';
import { eventDescriptionSchema } from '../../schemas/eventSchema';
import { EventError } from '@/errors/events';
import { Sublabel } from '@/components/Sublabel';
import { CheckboxInput } from '@/components/CheckboxInput';

export function DescriptionStep() {
  const { user } = useUserContext();

  const { handleChange, template, payload, inputStatus } = useCreateEventFormContext();
  return (
    <>
      <div className='form-input-group h-[50%]'>
        <textarea
          autoComplete='off'
          onChange={e => handleChange(e, eventDescriptionSchema)}
          name='description'
          placeholder='Description...'
          required
          spellCheck={false}
          defaultValue={template?.description || payload.get('description')?.toString()}
          className='w-full h-full'
        />
        {inputStatus.description === EventError.descriptionTooLong ? (
          <Sublabel variant='error'>The description is too long!</Sublabel>
        ) : null}
      </div>

      <CheckboxInput
        onChange={handleChange}
        type='checkbox'
        name='is_template'
        checked={payload.get('is_template') == 'true'}
        hidden={!user.subscription.allow_templates}
        label={<span>Save event as template?</span>}
        component={props => <input {...props} />}
      />
    </>
  );
}
