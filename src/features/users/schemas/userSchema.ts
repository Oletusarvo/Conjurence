import z from 'zod';

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  status: z.string(),
});

export type TUser = z.infer<typeof userSchema>;
