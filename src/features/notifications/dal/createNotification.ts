import { notificationSchema } from '@/features/notifications/schemas/notificationSchema';
import { tablenames } from '@/tablenames';
import { Knex } from 'knex';
import z from 'zod';

export async function createNotificationAction(
  notification: z.infer<typeof notificationSchema>,
  ctx: Knex | Knex.Transaction
) {
  const payload = notificationSchema.parse(notification);
  await ctx(tablenames.notification).insert(payload);
  global.io.to('user:' + notification.user_id).emit('new_notification');
}
