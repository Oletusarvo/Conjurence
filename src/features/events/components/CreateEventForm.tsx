'use client';

import { Armchair, Heading, MapPin, Pin, Text } from 'lucide-react';
import { Input } from '../../../components/Input';
import { withLoader } from '@/hoc/withLoader';
import { useCreateEventForm } from '../hooks/useCreateEventForm';
import { useRouter } from 'next/navigation';
import {
  eventDescriptionSchema,
  eventLocationTitleSchema,
  eventTitleSchema,
  TEvent,
  TEventData,
  TEventInstance,
} from '../schemas/eventSchema';
import { EventError } from '@/errors/events';
import { Notice } from '@/components/Notice';
import { useRef, useState } from 'react';
import { Sublabel } from '@/components/Sublabel';
import { capitalize } from '@/util/capitalize';
import { List } from '@/components/List';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useStep } from '@/providers/StepProvider';
import { StepTrack } from '@/components/StepTrack';
import { CheckboxContainer } from '@/components/CheckboxContainer';
import { LocationTitleBadge } from './LocationTitleBadge';
import { ZodType } from 'zod';

type TemplateType = TEventData & TEventInstance & Pick<TEvent, 'location_title'>;
type CategoriesType = { id: number; label: string; description?: string }[];
type ThresholdsType = { id: number; label: string; description: string }[];

const [CreateEventFormContext, useCreateEventFormContext] = createContextWithUseHook<
  ReturnType<typeof useCreateEventForm> & { template: TemplateType }
>('useCreateEventForm can only be called from within the scope of a CreateEventFormContext!');

type CreateEventFormProps = {
  categories: CategoriesType;
  thresholds: ThresholdsType;
  template?: TemplateType;
};

export function CreateEventForm({ categories, thresholds, template }: CreateEventFormProps) {
  const form = useCreateEventForm(template);
  const router = useRouter();
  const isForwardButtonDisabled = () => {
    const { inputStatus, steps } = form;
    if (steps.current == 0) {
      return inputStatus.title !== 'success' || inputStatus.location_title !== 'success';
    } else if (steps.current == 2) {
      return inputStatus.description !== 'success';
    }
  };
  const SubmitButton = withLoader(({ children, ...props }: React.ComponentProps<'button'>) => {
    return (
      <button
        {...props}
        className='--contained --accent --full-width'>
        {children}
      </button>
    );
  });

  const ForwardButton = () => (
    <button
      disabled={isForwardButtonDisabled()}
      className='--contained --accent --full-width'
      onClick={() => form.steps.forward()}
      type='button'>
      Next
    </button>
  );

  const BackwardButton = () => (
    <button
      type='button'
      className='--outlined --secondary --full-width'
      onClick={() => {
        if (form.steps.current === 0) {
          router.push('/app/feed');
        } else {
          form.steps.backward();
        }
      }}>
      {form.steps.current === 0 ? 'Cancel' : 'Back'}
    </button>
  );

  return (
    <form
      className='flex flex-col gap-2 sm:w-[450px] xs:w-full h-full'
      onSubmit={form.submitEvent}>
      <StepTrack
        currentStep={form.steps.current}
        max={3}
      />
      <CreateEventFormContext.Provider value={{ template, ...form }}>
        {form.steps.current === 0 ? (
          <OverviewStep />
        ) : form.steps.current === 1 ? (
          <TypesStep
            categories={categories}
            thresholds={thresholds}
          />
        ) : (
          <DescriptionStep />
        )}
        <StatusNotice status={form.status} />

        <div className='flex gap-2 w-full mt-auto'>
          <BackwardButton />
          {form.steps.current < 2 ? (
            <ForwardButton />
          ) : (
            <SubmitButton
              loading={form.isPending}
              disabled={form.isPending || form.status === 'success' || isForwardButtonDisabled()}
              type='submit'>
              Submit
            </SubmitButton>
          )}
        </div>
      </CreateEventFormContext.Provider>
    </form>
  );
}

function OverviewStep() {
  const { user } = useUserContext();

  const { payload, template, handleChange, inputStatus } = useCreateEventFormContext();
  console.log(payload.get('is_mobile'));

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

      <CheckboxContainer
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

function TypesStep({
  categories,
  thresholds,
}: {
  categories: CategoriesType;
  thresholds: ThresholdsType;
}) {
  const { payload, template, handleChange } = useCreateEventFormContext();
  const [selectedCategory, setSelectedCategory] = useState(
    () =>
      categories.find(
        c =>
          c.id == template?.event_category_id ||
          c.id == parseInt(payload.get('event_category_id')?.toString())
      )?.id || 0
  );
  const [selectedThreshold, setSelectedThreshold] = useState(
    () =>
      thresholds.find(t => t.id == parseInt(payload.get('event_threshold_id')?.toString()))?.id || 0
  );

  return (
    <>
      <div className='form-input-group'>
        <select
          name='event_category_id'
          value={selectedCategory}
          onChange={e => {
            handleChange(e);
            setSelectedCategory(e.target.value as any);
          }}
          required>
          <option
            value={0}
            disabled>
            Select event type...
          </option>
          <List
            data={categories}
            component={({ item: cat }) => {
              return <option value={cat.id}>{capitalize(cat.label)}</option>;
            }}
          />
        </select>
        {selectedCategory !== 0 && (
          <Sublabel>
            {categories.find(c => c.id == selectedCategory)?.description || 'No description.'}
          </Sublabel>
        )}
      </div>

      <div className='form-input-group'>
        <select
          name='event_threshold_id'
          value={selectedThreshold}
          onChange={e => {
            handleChange(e);
            setSelectedThreshold(e.target.value as any);
          }}
          required>
          <option
            value={0}
            disabled>
            Select event size...
          </option>
          <List
            data={thresholds}
            component={({ item }) => {
              return <option value={item.id}>{capitalize(item.label)}</option>;
            }}
          />
        </select>
        {selectedThreshold !== 0 && (
          <Sublabel>
            {thresholds.find(t => t.id == selectedThreshold)?.description || 'No description.'}
          </Sublabel>
        )}
      </div>
    </>
  );
}

function DescriptionStep() {
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

      <CheckboxContainer
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

function StatusNotice({ status }) {
  return status === EventError.descriptionTooLong ? (
    <Notice variant='error'>The description is too long!</Notice>
  ) : status === EventError.maximumTemplateCount ? (
    <Notice variant='error'>
      You have reached your template quota! Please uncheck the "save as template" box.
    </Notice>
  ) : status === EventError.singleAttendance ? (
    <Notice variant='error'>Cannot create an event while hosting- or joined to another!</Notice>
  ) : status === EventError.titleTooLong ? (
    <Notice variant='error'>The title is too long!</Notice>
  ) : status === EventError.titleTooShort ? (
    <Notice variant='error'>The title is too short!</Notice>
  ) : status === EventError.locationTooLong ? (
    <Notice variant='error'>The location is too long!</Notice>
  ) : status === 'success' ? (
    <Notice variant='success'>
      Event created successfully! Redirecting to the event screen...
    </Notice>
  ) : status === 'error' ? (
    <Notice variant='error'>An unexpected error occured!</Notice>
  ) : status === EventError.locationDisabled ? (
    <Notice variant='error'>
      Geolocation is disabled! Please enable it to be able to create events.
    </Notice>
  ) : status === EventError.mobileNotAllowed ? (
    <Notice variant='error'>Your subscription disallows mobile events!</Notice>
  ) : status === EventError.templatesNotAllowed ? (
    <Notice variant='error'>Your subscription disallows templates!</Notice>
  ) : status === EventError.sizeNotAllowed ? (
    <Notice variant='error'>Your subscription disallows events of the selected size!</Notice>
  ) : null;
}
