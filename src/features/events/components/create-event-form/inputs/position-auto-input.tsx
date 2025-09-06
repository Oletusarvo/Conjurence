import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';

/**Renders a hidden, dedicated input for the users current location, to stop flickering of the form when the location updates. */
export function PositionAutoInput() {
  const { position } = useGeolocationContext();
  const value =
    position &&
    JSON.stringify({
      coordinates: [position.coords.longitude, position.coords.latitude],
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    });

  return (
    <input
      name='position'
      value={value}
      hidden
    />
  );
}
