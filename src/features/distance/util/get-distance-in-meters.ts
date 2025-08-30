const R = 6371000; // Earth's radius in meters
const toRadians = (deg: number) => deg * (Math.PI / 180);

export function getDistanceInMeters(
  coords1: Pick<GeolocationCoordinates, 'longitude' | 'latitude'>,
  coords2: Pick<GeolocationCoordinates, 'longitude' | 'latitude'>
): number {
  const dLat = toRadians(coords2.latitude - coords1.latitude);
  const dLon = toRadians(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(coords1.latitude)) *
      Math.cos(toRadians(coords2.latitude)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
