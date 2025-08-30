import { TitleInput } from './inputs/title-input';
import { SpotsAvailableInput } from './inputs/spots-available-input';
import { DescriptionInput } from './inputs/description-input';

export function OverviewStep() {
  return (
    <>
      <TitleInput />
      <SpotsAvailableInput />
      <DescriptionInput />
    </>
  );
}
