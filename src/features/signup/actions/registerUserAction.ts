'use server';

import db from '@/dbconfig';
import { AuthError, TAuthError } from '@/errors/auth';
import { registerCredentialsSchema } from '@/features/signup/schemas/registerCredentialsSchema';
import { tablenames } from '@/tablenames';
import { hashPassword } from '@/util/auth/hashPassword';
import { parseFormDataUsingSchema } from '@/util/parseUsingSchema';
import { keyof } from 'zod';

export async function registerUserAction(
  payload: FormData
): Promise<ActionResponse<void, TAuthError>> {
  const parseResult = parseFormDataUsingSchema(payload, registerCredentialsSchema);
  if (parseResult.success) {
    //Fetch the unconfirmed user status id.

    const { email, password1: password, username } = parseResult.data;
    try {
      await db(tablenames.user).insert({
        user_status_id: db(tablenames.user_status)
          .where({ label: 'unconfirmed' })
          .select('id')
          .limit(1),
        username,
        email,
        password: await hashPassword(password),
        terms_accepted_on: new Date(),
      });
    } catch (err) {
      const msg = err.message.toLowerCase();

      if (msg.includes('duplicate')) {
        if (msg.includes('user_email')) {
          return { success: false, error: AuthError.duplicateEmail };
        } else if (msg.includes('user_username')) {
          return { success: false, error: AuthError.duplicateUsername };
        }
      }

      throw err;
    }

    return { success: true };
  } else {
    return {
      success: false,
      error: parseResult.error.issues.at(0)?.message as TAuthError,
    };
  }
}
