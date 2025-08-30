import { CategoriesType, ThresholdsType } from './create-event-form';
import { EventTypeSelector } from './inputs/event-type-selector';
import { EventCategorySelector } from './inputs/event-category-selector';
import { MobileEventCheckbox } from './inputs/mobile-event-checkbox';
import { IsTemplateCheckbox } from './inputs/is-template-checkbox';

export function TypesStep({
  categories,
  thresholds,
}: {
  categories: CategoriesType;
  thresholds: ThresholdsType;
}) {
  return (
    <>
      <EventCategorySelector categories={categories} />
      <EventTypeSelector thresholds={thresholds} />
      <MobileEventCheckbox />
      <IsTemplateCheckbox />
    </>
  );
}
