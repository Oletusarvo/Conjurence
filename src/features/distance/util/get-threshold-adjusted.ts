/**Returns a distance-threshold adjusted by taking into account the accuracy of two coordinates. */
export function getThresholdAdjusted(threshold: number, accuracy1: number, accuracy2: number) {
  const amount = Math.sqrt(accuracy1 ** 2 + accuracy2 ** 2);
  return threshold + amount;
}
