import { EventError } from '@/errors/events';
import z from 'zod';

export const eventTitleSchema = z
  .string()
  .min(3, EventError.titleTooShort)
  .max(24, EventError.titleTooLong)
  .trim();

export const eventDescriptionSchema = z.string().max(256, EventError.descriptionTooLong).trim();

export const eventDataSchema = z.object({
  id: z.uuid().optional(),
  title: eventTitleSchema,
  description: eventDescriptionSchema,
  spots_available: z
    .string()
    .optional()
    .transform(val => parseInt(val)),
  event_category_id: z.string().transform(val => parseInt(val)),
  is_template: z
    .string()
    .transform(val => val === 'true')
    .optional(),
});

export const eventLocationTitleSchema = z
  .string()
  .min(3, EventError.locationTooShort)
  .max(64, EventError.locationTooLong)
  .trim()
  .optional();

export const eventInstanceSchema = z.object({
  created_at: z.date().optional(),
  ended_at: z.date().optional(),
  position: z.string().optional(),
  location_title: eventLocationTitleSchema,
  position_accuracy: z.number().optional(),
  event_threshold_id: z.string().transform(val => parseInt(val)),
  is_mobile: z
    .string()
    .transform(val => val === 'true')
    .optional(),
});

export const eventSchema = z
  .object({
    id: z.uuid(),
    category: z.string(),
    host: z.string(),
    interested_count: z.number(),
    attendance_count: z.number(),
    auto_join_threshold: z.number(),
    auto_leave_threshold: z.number(),
  })
  .extend(eventDataSchema.shape)
  .extend(eventInstanceSchema.shape)
  .omit({
    event_category_id: true,
    position: true,
  });

export type TEventData = z.infer<typeof eventDataSchema>;
export type TEventInstance = z.infer<typeof eventInstanceSchema>;
export type TEvent = z.infer<typeof eventSchema> & { position: { coordinates: number[] } };
