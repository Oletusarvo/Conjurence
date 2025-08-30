import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import z, { superRefine } from 'zod';

export const notificationSchema = z.object({
  user_id: z.uuid(),
  notification_type_id: z.int(),
  seen_at: z.date().optional(),
  created_at: z.date().optional(),
  data: z.any(),
});

const joinRequestDataSchema = z.object({
  user_id: z.uuid(),
  event_id: z.uuid(),
  event_title: z.string(),
  username: z.string(),
});
