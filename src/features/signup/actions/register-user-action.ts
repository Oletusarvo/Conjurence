'use server';

import db from '@/dbconfig';
import { TAuthError } from '@/errors/auth';
import { registerCredentialsSchema } from '@/features/signup/schemas/register-credentials-schema';
import {
  parseFormDataUsingSchema,
  unsafeParseFormDataUsingSchema,
} from '@/util/parse-form-data-using-schema';
import { userService } from '@/features/users/services/user-service';
import { getParseResultErrorMessage } from '@/util/get-parse-result-error-message';
import { tryCatch } from '@/util/try-catch';

export async function registerUserAction(
  payload: FormData
): Promise<ActionResponse<void, TAuthError | string>> {
  try {
    const parseResult = parseFormDataUsingSchema(payload, registerCredentialsSchema);
    if (!parseResult.success)
      return { success: false, error: getParseResultErrorMessage(parseResult) };

    const [res, error] = await tryCatch(
      async () => await userService.registerUser(parseResult.data, db)
    );
    if (error) return { success: false, error };

    return {
      success: true,
    };
  } catch (err) {
    console.log('register-user-action: ', err.message);
    return {
      success: false,
      error: 'An unexpected error occured!',
    };
  }
}
