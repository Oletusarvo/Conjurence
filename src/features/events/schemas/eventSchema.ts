import { EventError } from '@/errors/events';
import z from 'zod';

export const eventDataSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().min(3, EventError.titleTooShort).max(24, EventError.titleTooLong).trim(),
  description: z.string().max(256, EventError.descriptionTooLong).trim(),
  spots_available: z
    .string()
    .optional()
    .transform(val => parseInt(val)),
  event_category_id: z.string().transform(val => parseInt(val)),
  is_template: z
    .string()
    .transform(val => (val === 'on' ? true : false))
    .optional(),
});

export const eventInstanceSchema = z.object({
  created_at: z.date().optional(),
  ended_at: z.date().optional(),
  position: z.string().optional(),
  location_title: z.string().min(3).max(64).trim().optional(),
  position_accuracy: z.number().optional(),
  event_threshold_id: z.string().transform(val => parseInt(val)),
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
