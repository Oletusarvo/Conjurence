import z from 'zod';
import { passwordSchema } from '../../../schemas/password-schema';
import { AuthError } from '@/errors/auth';

export const emailSchema = z
  .email()
  .trim()
  .refine(val => val.endsWith('@gmail.com'), AuthError.emailInvalidDomain);

export const verifyEmailSchema = z.object({
  email: emailSchema,
});

export const registerCredentialsSchema = z
  .object({
    token: z.jwt(),
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
  }, AuthError.passwordMismatch);
