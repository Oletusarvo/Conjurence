'use server';

import db from '@/dbconfig';
import { sendEmailVerification } from '../util/send-email-verification';
import { TAuthError } from '@/errors/auth';
import { verifyEmailSchema } from '../schemas/register-credentials-schema';
import { parseFormDataUsingSchema } from '@/util/parse-form-data-using-schema';
import { userService } from '@/features/users/services/user-service';
import { getParseResultErrorMessage } from '@/util/get-parse-result-error-message';

export async function sendEmailVerificationAction(
  payload: FormData
): Promise<ActionResponse<void, TAuthError | string>> {
  try {
    const emailParseResult = parseFormDataUsingSchema(payload, verifyEmailSchema);
    if (!emailParseResult.success)
      return { success: false, error: getParseResultErrorMessage(emailParseResult) };

    const { email } = emailParseResult.data;

    const user = await userService.repo.findByEmail(email, db);
    if (user) {
      return {
        success: false,
        error: 'auth:duplicate_email',
      };
    }

    await sendEmailVerification(email);
    return { success: true };
  } catch (err) {
    console.log('send-email-verification-action: ', err.message);
    return {
      success: false,
      error: 'An unexpected error occured!',
    };
  }
}
