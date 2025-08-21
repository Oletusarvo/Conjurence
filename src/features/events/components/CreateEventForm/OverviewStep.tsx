import { TitleInput } from './inputs/TitleInput';
import { SpotsAvailableInput } from './inputs/SpotsAvailableInput';
import { DescriptionInput } from './inputs/DescriptionInput';

export function OverviewStep() {
  return (
    <>
      <TitleInput />
      <SpotsAvailableInput />
      <DescriptionInput />
    </>
  );
}
