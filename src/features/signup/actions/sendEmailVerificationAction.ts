'use server';

import db from '@/dbconfig';
import { sendEmailVerification } from '../util/sendEmailVerification';
import { tablenames } from '@/tablenames';
import { TAuthError } from '@/errors/auth';
import { emailSchema, verifyEmailSchema } from '../schemas/registerCredentialsSchema';
import { getParseResultErrorMessage } from '@/util/getParseResultErrorMessage';
import { parseFormDataUsingSchema } from '@/util/parseUsingSchema';

export async function sendEmailVerificationAction(
  payload: FormData
): Promise<ActionResponse<void, TAuthError>> {
  const emailParseResult = parseFormDataUsingSchema(payload, verifyEmailSchema);

  if (!emailParseResult.success) {
    const msg = getParseResultErrorMessage<TAuthError>(emailParseResult);
    return {
      success: false,
      error: msg,
    };
  }

  const { email } = emailParseResult.data;
  const user = await db(tablenames.user).where({ email }).first();
  if (user) {
    return {
      success: false,
      error: 'auth:duplicate_email',
    };
  }

  await sendEmailVerification(email);
  return { success: true };
}
