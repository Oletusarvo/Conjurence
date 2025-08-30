import { Notice } from '@/components/ui/notice-temp';
import { EventError } from '@/errors/events';

export function StatusNotice({ status }) {
  return status === EventError.descriptionTooLong ? (
    <Notice variant='error'>The description is too long!</Notice>
  ) : status === EventError.maximumTemplateCount ? (
    <Notice variant='error'>
      You have reached your template quota! Please uncheck the "save as template" box.
    </Notice>
  ) : status === EventError.singleAttendance ? (
    <Notice variant='error'>Cannot create an event while hosting- or joined to another!</Notice>
  ) : status === EventError.titleTooLong ? (
    <Notice variant='error'>The title is too long!</Notice>
  ) : status === EventError.titleTooShort ? (
    <Notice variant='error'>The title is too short!</Notice>
  ) : status === EventError.locationTooLong ? (
    <Notice variant='error'>The location is too long!</Notice>
  ) : status === 'success' ? (
    <Notice variant='success'>
      Event created successfully! Redirecting to the event screen...
    </Notice>
  ) : status === 'error' ? (
    <Notice variant='error'>An unexpected error occured!</Notice>
  ) : status === EventError.locationDisabled ? (
    <Notice variant='error'>
      Geolocation is disabled! Please enable it to be able to create events.
    </Notice>
  ) : status === EventError.mobileNotAllowed ? (
    <Notice variant='error'>Your subscription disallows mobile events!</Notice>
  ) : status === EventError.templatesNotAllowed ? (
    <Notice variant='error'>Your subscription disallows templates!</Notice>
  ) : status === EventError.sizeNotAllowed ? (
    <Notice variant='error'>Your subscription disallows events of the selected size!</Notice>
  ) : null;
}
