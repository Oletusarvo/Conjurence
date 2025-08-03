import { AuthError } from '@/errors/auth';
import z from 'zod';

export const passwordSchema = z
  .string()
  .min(8, AuthError.passwordTooShort)
  .max(16, AuthError.passwordTooLong)
  .refine(pass => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(pass);
  }, AuthError.passwordInvalidFormat);
