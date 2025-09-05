'use client';

import { withLoader } from '@/hoc/with-loader';
import { useCreateEventForm } from '../../hooks/use-create-event-form';
import { useRouter } from 'next/navigation';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { StepTrack } from '@/components/step-track';
import { OverviewStep } from './overview-step';
import { TypesStep } from './types-step';
import { StatusNotice } from './status-notice';
import { useEventContext } from '../../providers/event-provider';
import { TEvent } from '../../schemas/event-schema';

export type CategoriesType = { id: number; label: string; description?: string }[];
export type ThresholdsType = { id: number; label: string; description: string }[];

const [CreateEventFormContext, useCreateEventFormContext] = createContextWithUseHook<
  ReturnType<typeof useCreateEventForm> & { template: TEvent }
>('useCreateEventForm can only be called from within the scope of a CreateEventFormContext!');

export { useCreateEventFormContext };

export function CreateEventForm({ onCancel = null }) {
  const { event: template } = useEventContext();
  const form = useCreateEventForm();
  const router = useRouter();

  const isForwardButtonDisabled = () => {
    const { inputStatus, steps } = form;
    if (steps.current == 0) {
      return inputStatus.title !== 'success' || inputStatus.description !== 'success';
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
          if (onCancel) {
            onCancel();
          } else {
            router.push('/app/feed');
          }
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
        max={2}
      />
      <CreateEventFormContext.Provider value={{ template, ...form }}>
        {form.steps.current === 0 ? (
          <OverviewStep />
        ) : form.steps.current === 1 ? (
          <TypesStep />
        ) : null}
        <StatusNotice status={form.status} />

        <div className='flex gap-2 w-full mt-auto px-default'>
          <BackwardButton />
          {form.steps.current < 1 ? (
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
