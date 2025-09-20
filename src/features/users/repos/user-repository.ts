import { tablenames } from '@/tablenames';
import { hashPassword } from '@/util/auth/hash-password';
import { DBContext } from '@/util/db-context';
import { Repository } from '@/util/repository';

export class UserRepository extends Repository {
  async getSubscription(user_id: string, ctx: DBContext) {
    return await ctx(tablenames.user_subscription)
      .where({
        id: ctx
          .select('user_subscription_id')
          .from(tablenames.user)
          .where({ id: user_id })
          .limit(1),
      })
      .first();
  }

  async getContactByUserId(user_id: string, ctx: DBContext) {
    return await ctx(tablenames.user_contact).where({ user_id }).first();
  }

  /**Finds a user by email. */
  async findByEmail(email: string, ctx: DBContext) {
    return await ctx(tablenames.user).where({ email }).first();
  }

  /**Creates a new user record. */
  async create(
    {
      username,
      email,
      password,
      subscription,
    }: {
      username: string;
      email: string;
      password: string;
      subscription: 'free' | 'pro' | 'enterprise';
    },
    ctx: DBContext
  ) {
    const [newUserRecord] = await ctx(tablenames.user).insert(
      {
        user_status_id: ctx(tablenames.user_status)
          .where({ label: 'pending' })
          .select('id')
          .limit(1),
        username,
        email,
        password: await hashPassword(password),
        terms_accepted_on: new Date(),
        user_subscription_id: ctx
          .select('id')
          .from(tablenames.user_subscription)
          .where({ label: subscription })
          .limit(1),
      },
      ['id']
    );
    return newUserRecord;
  }

  async deleteById(id: string, ctx: DBContext) {
    await ctx(tablenames.user).where({ id }).delete();
  }
}
