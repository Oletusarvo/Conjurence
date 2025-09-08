import { TitleInput } from './inputs/title-input';
import { SpotsAvailableInput } from './inputs/spots-available-input';
import { DescriptionInput } from './inputs/description-input';
import { LocationInput } from './inputs/location-input';

export function OverviewStep({ show }: { show: boolean }) {
  return (
    <div
      className='px-default flex flex-col gap-2 flex-1'
      hidden={!show}>
      <TitleInput />
      <SpotsAvailableInput />
      <DescriptionInput />
    </div>
  );
}
