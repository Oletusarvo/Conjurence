import { name as packageName } from '@package';
import { sendEmail } from '@/util/network/sendEmail';
import { createJWT } from '@/util/auth/JWT';

export async function sendEmailVerification(userId: string, to: string) {
  const token = createJWT(
    { user_id: userId },
    {
      expiresIn: '1d',
    }
  );

  await sendEmail({
    to,
    subject: 'Verify Your Account',
    html: `
      <h1>Verify Your Email</h1>
      <strong>Hi there!</strong>
      <p>
        It seems you have requested to sign up to <a href="${process.env.DOMAIN_URL}"><strong>${packageName}.</strong></a><br/>
        If it was not you who signed up, you can safely ignore this message.<br/><br/>
        Otherwise please click <a href="${process.env.DOMAIN_URL}/api/users/verify?token=${token}">this link</a> to activate your account.
        <br/><br/>
        Best regards, the ${packageName} team.
      </p>
    `,
  });
}
