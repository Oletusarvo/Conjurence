import { createFeatureErrorFn } from '@/util/error/createFeature';

const getError = createFeatureErrorFn('event');
export const EventError = {
  titleTooShort: getError('title_too_short'),
  titleTooLong: getError('title_too_long'),
  descriptionTooLong: getError('description_too_long'),
  maximumTemplateCount: getError('maximum_template_count'),
  singleAttendance: getError('single_attendance'),
  locationTooLong: getError('location_too_long'),
  locationDisabled: getError('location_disabled'),
};

export type TEventError = (typeof EventError)[keyof typeof EventError];
