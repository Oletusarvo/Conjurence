import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { Knex } from 'knex';

export async function getUser(id: string, ctx: Knex | Knex.Transaction) {
  return (await ctx(`${tablenames.user} as u`)
    .join(db.raw(`${tablenames.user_status} as us on us.id = u.user_status_id`))
    .where({ 'u.id': id })
    .select('u.id', 'email', 'username', 'us.label as status')
    .first()) as
    | {
        id: string;
        username: string;
        email: string;
        status: string;
      }
    | undefined;
}
