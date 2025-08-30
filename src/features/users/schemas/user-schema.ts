import z from 'zod';

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  status: z.string(),
  subscription: z.object({
    allow_templates: z.boolean().optional(),
    allow_mobile_events: z.boolean().optional(),
    maximum_event_size_id: z.int(),
  }),
});

export type TUser = z.infer<typeof userSchema>;
