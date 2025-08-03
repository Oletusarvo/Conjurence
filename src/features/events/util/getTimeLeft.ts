import { getExpiryTime } from './getExpiryTime';

export const getTimeLeft = (e: any) => {
  const expiryTime = getExpiryTime(e);
  return expiryTime - Date.now();
};
