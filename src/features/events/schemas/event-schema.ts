import { EventError } from '@/features/events/errors/events';
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
  position: z.string().optional(),
  position_metadata: z.string().transform(val => {
    return JSON.parse(val) as {
      accuracy: number;
      timestamp: number;
    };
  }),

  event_threshold_id: z.string().transform(val => parseInt(val)),
  is_mobile: z
    .string()
    .transform(val => val === 'true')
    .optional(),
});

export const eventSchema = eventDataSchema.extend(eventInstanceSchema.shape).omit({
  event_category_id: true,
  position: true,
});

export type TEventData = z.infer<typeof eventDataSchema>;
export type TEventInstance = z.infer<typeof eventInstanceSchema>;
export type TEvent = z.infer<typeof eventSchema> & {
  id: string;
  category: string;
  host: string;
  interested_count: number;
  attendance_count: number;
  auto_join_threshold: number;
  auto_leave_threshold: number;
  position: { coordinates: number[] };
  created_at: Date;
  ended_at: Date;
};
