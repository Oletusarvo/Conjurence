import { createFeatureErrorFn } from '@/util/error/createFeature';

const getError = createFeatureErrorFn('event');
export const EventError = {
  titleTooShort: getError('title_too_short'),
  titleTooLong: getError('title_too_long'),
  descriptionTooLong: getError('description_too_long'),
};

export type TEventError = (typeof EventError)[keyof typeof EventError];
