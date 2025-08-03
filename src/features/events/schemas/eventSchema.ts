import z from 'zod';

export const eventDataSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().min(3).max(24).trim(),
  description: z.string().max(256).trim(),
  location: z.string().max(32).trim(),
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
});

export const eventSchema = z
  .object({
    id: z.uuid(),
    category: z.string(),
    host: z.string(),
    interested_count: z.number(),
  })
  .extend(eventDataSchema.shape)
  .extend(eventInstanceSchema.shape)
  .omit({
    event_category_id: true,
  });

export type TEventData = z.infer<typeof eventDataSchema>;
export type TEventInstance = z.infer<typeof eventInstanceSchema>;
export type TEvent = z.infer<typeof eventSchema>;
