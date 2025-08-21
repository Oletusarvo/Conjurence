import { CategoriesType, ThresholdsType } from './CreateEventForm';
import { EventTypeSelector } from './EventTypeSelector';
import { EventCategorySelector } from './EventCategorySelector';
import { MobileEventCheckbox } from './inputs/MobileEventCheckbox';
import { IsTemplateCheckbox } from './IsTemplateCheckbox';

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
