'use server';

import db from '@/dbconfig';
import { AuthError } from '@/errors/auth';
import { registerCredentialsSchema } from '@/features/signup/schemas/registerCredentialsSchema';
import { tablenames } from '@/tablenames';
import { hashPassword } from '@/util/auth/hashPassword';
import { parseFormDataUsingSchema } from '@/util/parseUsingSchema';

export async function registerUserAction(payload: FormData) {
  const parseResult = parseFormDataUsingSchema(payload, registerCredentialsSchema);
  if (parseResult.success) {
    //Fetch the unconfirmed user status id.
    const userStatusRecord = await db(tablenames.user_status)
      .where({ label: 'unconfirmed' })
      .select('id')
      .first();

    const { email, password1: password, username } = parseResult.data;
    try {
      await db(tablenames.user).insert({
        user_status_id: userStatusRecord.id,
        username,
        email,
        password: await hashPassword(password),
        terms_accepted_on: new Date(),
      });
    } catch (err) {
      const msg = err.message.toLowerCase();
      if (msg.includes('duplicate')) {
        if (msg.includes('user_email')) {
          return AuthError.duplicateEmail;
        } else if (msg.includes('user_username')) {
          return AuthError.duplicateUsername;
        }
      }
      return 'error';
    }

    return 'success';
  } else {
    return parseResult.error.issues.at(0)?.message as string;
  }
}
