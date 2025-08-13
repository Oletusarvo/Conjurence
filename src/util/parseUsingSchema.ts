import { ZodType } from 'zod';

/**Safe-parses FormData using the passed Zod-schema, returning the result.*/
export const parseFormDataUsingSchema = <T extends ZodType>(payload: FormData, schema: T) => {
  return schema.safeParse(Object.fromEntries(payload));
};
