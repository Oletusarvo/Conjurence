'use server';

import db from '@/dbconfig';
import { sendEmailVerification } from '../util/send-email-verification';
import { tablenames } from '@/tablenames';
import { TAuthError } from '@/errors/auth';
import { emailSchema, verifyEmailSchema } from '../schemas/register-credentials-schema';
import { getParseResultErrorMessage } from '@/util/get-parse-result-error-message';
import { parseFormDataUsingSchema } from '@/util/parse-form-data-using-schema';

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
