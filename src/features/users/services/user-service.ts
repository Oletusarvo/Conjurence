import { registerCredentialsSchema } from '@/features/signup/schemas/register-credentials-schema';
import { verifyJWT } from '@/util/auth/jwt-temp';
import { DBContext } from '@/util/db-context';
import { Service } from '@/util/service';
import z from 'zod';
import { UserRepository } from '../repos/user-repository';
import { AuthError } from '@/errors/auth';

class UserService extends Service<UserRepository> {
  constructor(repo: UserRepository) {
    super(repo);
  }

  async registerUser(payload: z.infer<typeof registerCredentialsSchema>, ctx: DBContext) {
    try {
      const { token, password1: password, username } = payload;
      const { email } = verifyJWT(token) as { email: string };

      await this.repo.create(
        {
          email,
          password,
          username,
          subscription: 'free',
        },
        ctx
      );
    } catch (err) {
      const msg = err.message.toLowerCase();

      if (msg.includes('duplicate')) {
        if (msg.includes('user_email')) {
          throw new Error(AuthError.duplicateEmail);
        } else if (msg.includes('user_username')) {
          throw new Error(AuthError.duplicateUsername);
        }
      }

      throw err;
    }
  }
}

export const userService = new UserService(new UserRepository());
