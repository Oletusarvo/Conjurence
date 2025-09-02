import { ZodType } from 'zod';
import { getParseResultErrorMessage } from './get-parse-result-error-message';
import { formDataToObject } from './form-data-to-object';

/**Safe-parses FormData using the passed Zod-schema, returning the result.*/
export const parseFormDataUsingSchema = <T extends ZodType>(payload: FormData, schema: T) => {
  return schema.safeParse(formDataToObject(payload));
};

/**Parses FormData using the passed Zod-schema. Returns the parsed data, or throws an error if it fails. */
export const unsafeParseFormDataUsingSchema = <T extends ZodType>(payload: FormData, schema: T) => {
  return schema.parse(formDataToObject(payload));
};
