'use server';

import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { hashPassword } from '@/util/auth/hashPassword';
import { verifyJWT } from '@/util/auth/JWT';

export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<ActionResponse<void, void>> {
  const payload = verifyJWT(token) as { user_id: string };
  await db(tablenames.user)
    .where({
      id: payload.user_id,
    })
    .update({
      password: await hashPassword(newPassword),
    });
  return { success: true };
}
