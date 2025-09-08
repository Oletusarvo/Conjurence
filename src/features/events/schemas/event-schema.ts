import z from 'zod';
import { eventSizeSchema } from './event-size-schema';
import { EventError } from '../errors/events';
import { eventCategorySchema } from './event-category-schema';

export const createEventSchema = z.object({
  title: z.string().min(3, EventError.titleTooShort).max(24, EventError.titleTooLong).trim(),
  description: z.string().max(256).trim(),

  spots_available: z
    .string()
    .optional()
    .transform(val => Number(val))
    .pipe(z.number().min(1)),

  category: eventCategorySchema,
  position: z
    .string()
    .transform(val => JSON.parse(val))
    .pipe(
      z.object({
        coordinates: z.array(z.number()).length(2, 'position:invalid_length'),
        accuracy: z.number(),
        timestamp: z.number(),
      })
    ),

  size: eventSizeSchema,
  is_mobile: z
    .string()
    .transform(val => val === 'on')
    .pipe(z.boolean())
    .optional(),
});

export const updateEventSchema = createEventSchema
  .omit({
    position: true,
    size: true,
    category: true,
    is_mobile: true,
  })
  .partial()
  .extend({
    ended_at: z.date(),
    id: z.uuid(),
  });

export type TEvent = z.infer<typeof createEventSchema> & {
  id: string;
  host: string;
  interested_count: number;
  attendance_count: number;
  auto_join_threshold: number;
  auto_leave_threshold: number;
  position: { coordinates: number[] };
  created_at: string;
  ended_at: string;
};
