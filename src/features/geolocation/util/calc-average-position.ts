export const calcAveragePosition = (positions: GeolocationPosition[]) => {
  const summed = positions.reduce(
    (acc, cur) => {
      acc.coords.accuracy += cur.coords.accuracy;
      acc.coords.latitude += cur.coords.latitude;
      acc.coords.longitude += cur.coords.longitude;
      return acc;
    },
    { coords: { accuracy: 0, latitude: 0, longitude: 0 }, timestamp: 0 }
  );

  summed.timestamp = Date.now();
  const len = positions.length;
  summed.coords.accuracy /= len;
  summed.coords.latitude /= len;
  summed.coords.longitude /= len;
  return summed;
};
