import { transport } from '@/nodemailer.config';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const result = await transport.sendMail({
    from: 'nistikemisti@gmail.com',
    to,
    subject,
    html,
  });
}
