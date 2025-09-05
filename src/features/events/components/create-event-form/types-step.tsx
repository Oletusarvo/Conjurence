import { EventTypeSelector } from './inputs/event-type-selector';
import { EventCategorySelector } from './inputs/event-category-selector';
import { MobileEventCheckbox } from './inputs/mobile-event-checkbox';

export function TypesStep() {
  return (
    <>
      <div className='flex flex-col gap-2 px-default flex-1'>
        <EventCategorySelector />
        <EventTypeSelector />
        <MobileEventCheckbox />
      </div>
    </>
  );
}
