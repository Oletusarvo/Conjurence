'use client';

import { withLoader } from '@/hoc/withLoader';
import { useCreateEventForm } from '../../hooks/useCreateEventForm';
import { useRouter } from 'next/navigation';
import { TEvent, TEventData, TEventInstance } from '../../schemas/eventSchema';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { StepTrack } from '@/components/StepTrack';
import { OverviewStep } from './OverviewStep';
import { TypesStep } from './TypesStep';
import { DescriptionStep } from './DescriptionStep';
import { StatusNotice } from './StatusNotice';

export type TemplateType = TEventData & TEventInstance & Pick<TEvent, 'location_title'>;
export type CategoriesType = { id: number; label: string; description?: string }[];
export type ThresholdsType = { id: number; label: string; description: string }[];

const [CreateEventFormContext, useCreateEventFormContext] = createContextWithUseHook<
  ReturnType<typeof useCreateEventForm> & { template: TemplateType }
>('useCreateEventForm can only be called from within the scope of a CreateEventFormContext!');

export { useCreateEventFormContext };

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
