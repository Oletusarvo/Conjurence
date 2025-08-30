import { name as packageName } from '@package';
import { sendEmail } from '@/util/network/send-mail';
import { createJWT } from '@/util/auth/jwt-temp';

export async function sendEmailVerification(email: string) {
  const token = createJWT(
    { email },
    {
      expiresIn: '1d',
    }
  );

  await sendEmail({
    to: email,
    subject: 'Verify Your Account',
    html: `
      <h1>Verify Your Email</h1>
      <strong>Hi there!</strong>
      <p>
        It seems you have requested to sign up to <a href="${process.env.DOMAIN_URL}"><strong>${packageName}.</strong></a><br/>
        If it was not you who signed up, you can safely ignore this message.<br/><br/>
        Otherwise please click <a href="${process.env.DOMAIN_URL}/register?token=${token}">this link</a> to continue the registration process.
        <br/><br/>
        Best regards, the ${packageName} team.
      </p>
    `,
  });
}
