import { CategoriesType, ThresholdsType } from './CreateEventForm';
import { EventTypeSelector } from './inputs/EventTypeSelector';
import { EventCategorySelector } from './inputs/EventCategorySelector';
import { MobileEventCheckbox } from './inputs/MobileEventCheckbox';
import { IsTemplateCheckbox } from './inputs/IsTemplateCheckbox';

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
