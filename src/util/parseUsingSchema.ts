import { ZodType } from 'zod';

export const parseFormDataUsingSchema = <T extends ZodType>(payload: FormData, schema: T) => {
  return schema.safeParse(Object.fromEntries(payload));
};
