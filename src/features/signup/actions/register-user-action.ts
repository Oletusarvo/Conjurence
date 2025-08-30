'use server';

import db from '@/dbconfig';
import { AuthError, TAuthError } from '@/errors/auth';
import { registerCredentialsSchema } from '@/features/signup/schemas/register-credentials-schema';
import { tablenames } from '@/tablenames';
import { hashPassword } from '@/util/auth/hash-password';
import { parseFormDataUsingSchema } from '@/util/parse-form-data-using-schema';
import { sendEmailVerification } from '../util/send-email-verification';
import { verifyJWT } from '@/util/auth/jwt-temp';

export async function registerUserAction(
  payload: FormData
): Promise<ActionResponse<void, TAuthError | string>> {
  const parseResult = parseFormDataUsingSchema(payload, registerCredentialsSchema);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues.at(0)?.message as TAuthError,
    };
  }

  const { token, password1: password, username } = parseResult.data;
  const { email } = verifyJWT(token) as { email: string };

  const trx = await db.transaction();
  try {
    const [newUserRecord] = await trx(tablenames.user).insert(
      {
        user_status_id: db(tablenames.user_status)
          .where({ label: 'pending' })
          .select('id')
          .limit(1),
        username,
        email,
        password: await hashPassword(password),
        terms_accepted_on: new Date(),
        user_subscription_id: db
          .select('id')
          .from(tablenames.user_subscription)
          .where({ label: 'free' })
          .limit(1),
      },
      ['id']
    );

    await trx.commit();
    return {
      success: true,
    };
  } catch (err) {
    await trx.rollback();
    console.log('user:register: ', err.message);
    const msg = err.message.toLowerCase();

    if (msg.includes('duplicate')) {
      if (msg.includes('user_email')) {
        return { success: false, error: AuthError.duplicateEmail };
      } else if (msg.includes('user_username')) {
        return { success: false, error: AuthError.duplicateUsername };
      }
    }

    throw new Error('An unexpected error occured!');
  }
}
