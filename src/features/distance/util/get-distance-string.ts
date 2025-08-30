export const getDistanceString = (distance: number) => {
  const unit = distance < 1000 ? 'm' : 'km';
  return Math.round(distance < 1000 ? distance : distance / 1000).toLocaleString('fi') + ` ${unit}`;
};
