import { EventTypeSelector } from './inputs/event-type-selector';
import { EventCategorySelector } from './inputs/event-category-selector';
import { MobileEventCheckbox } from './inputs/mobile-event-checkbox';
import { PositionAutoInput } from './inputs/position-auto-input';
import { IsTemplateCheckbox } from './inputs/is-template-checkbox';
import { useCreateEventForm } from '../../hooks/use-create-event-form';
import { useCreateEventFormContext } from './create-event-form';

export function TypesStep({ show }: { show: boolean }) {
  const { template } = useCreateEventFormContext();
  return (
    <>
      <div
        className='flex flex-col gap-2 px-default flex-1'
        hidden={!show}>
        <EventCategorySelector />
        <EventTypeSelector />
        <MobileEventCheckbox />
        {!template && <IsTemplateCheckbox />}
        <PositionAutoInput />
      </div>
    </>
  );
}
