import { tablenames } from '@/tablenames';
import { Knex } from 'knex';

export function getContact(username: string, ctx: Knex | Knex.Transaction) {
  return ctx({ c: tablenames.user_contact })
    .join(ctx.select('username', 'id').from(tablenames.user).as('u'), 'u.id', 'c.user_id')
    .join(
      ctx.select('id', 'label as contact').from(tablenames.user_contact_type).as('ct'),
      'ct.id',
      'c.contact_type_id'
    )
    .where({ 'u.username': username })
    .select(
      ctx.raw('CASE WHEN ct.contact = ? THEN c.contact ELSE NULL END AS ??', [
        'messenger',
        'messenger',
      ]),
      ctx.raw('CASE WHEN ct.contact = ? THEN c.contact ELSE NULL END AS ??', [
        'whatsapp',
        'whatsapp',
      ])
    )
    .first();
}
