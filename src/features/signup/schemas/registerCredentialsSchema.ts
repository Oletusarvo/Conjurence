import z from 'zod';
import { passwordSchema } from '../../../schemas/passwordSchema';
import { AuthError } from '@/errors/auth';

export const registerCredentialsSchema = z
  .object({
    email: z.email().trim(),
    username: z
      .string()
      .min(3, AuthError.usernameTooShort)
      .max(24, AuthError.usernameTooLong)
      .trim(),
    password1: passwordSchema,
    password2: passwordSchema,
    terms_accepted: z.literal('on'),
  })
  .refine(creds => {
    const { password1, password2 } = creds;
    return password1 === password2;
  }, AuthError.passwordMismatch)
  .refine(creds => {
    const { email } = creds;
    return email.endsWith('@gmail.com');
  }, AuthError.emailInvalidDomain);
