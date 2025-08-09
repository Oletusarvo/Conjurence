'use server';

import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { createJWT } from '@/util/auth/JWT';
import { sendEmail } from '@/util/network/sendEmail';
import { name as packageName } from '@package';

export async function sendPasswordResetEmailAction(
  to: string
): Promise<ActionResponse<void, string>> {
  const userRecord = await db(tablenames.user)
    .where({ email: to })
    .select('id', 'username')
    .first();
  const token = createJWT({ user_id: userRecord.id }, { expiresIn: '1h' });
  await sendEmail({
    to,
    subject: `Reset Your ${packageName} password`,
    html: `
      <h1>Reset Your ${packageName} Password</h1>
      <strong>Hello ${userRecord.username}!</strong><br/><br/>

      <p>
        You have requested to reset your ${packageName} password.<br/>
        If it wasn't you, please ignore this message.<br/>
        Otherwise, <a href="${process.env.DOMAIN_URL}/login/reset?token=${token}">click here.</a><br/><br/>
        Best regards, the ${packageName} team.
      </p>
    `,
  });
  return { success: true };
}
