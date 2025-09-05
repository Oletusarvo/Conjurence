import { TitleInput } from './inputs/title-input';
import { SpotsAvailableInput } from './inputs/spots-available-input';
import { DescriptionInput } from './inputs/description-input';
import { LocationInput } from './inputs/location-input';

export function OverviewStep() {
  return (
    <div className='px-default flex flex-col gap-2 flex-1'>
      <TitleInput />
      <SpotsAvailableInput />
      <DescriptionInput />
    </div>
  );
}
