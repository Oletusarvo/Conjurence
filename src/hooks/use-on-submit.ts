import z from 'zod';
import { useStatus } from './use-status';
import { parseFormDataUsingSchema } from '@/util/parse-form-data-using-schema';

type UseOnSubmitProps<
  T,
  E extends string,
  TAction extends (payload: FormData) => Promise<ActionResponse<T, E>>
> = {
  /**Alternative FormData-source to use. Will ignore the form contents if defined. */
  payload?: FormData;
  action: TAction;
  validationSchema?: z.ZodType;
  /**Called when the action returns a response with success set to true. */
  onSuccess?: (res: SuccessActionResponse<T>) => void | Promise<void>;
  /**Called when the action return a response with success set to false. */
  onFailure?: (res: FailureActionResponse<E>) => void | Promise<void>;
  /**Called when the action throws an error. */
  onError?: (err: unknown) => void;
  /**Called when the validationSchema returns an error. */
  onParseError?: (err: z.ZodError) => void;
  onFinished?: () => void;
};

/**
 * Use for creating onSubmit-methods for forms. Handles validation using zod-schemas, and setting status under the hood.
 */
export function useOnSubmit<
  T,
  E extends string,
  TAction extends (e: FormData) => Promise<ActionResponse<T, E>>
>({
  payload,
  action,
  validationSchema,
  onSuccess,
  onError,
  onParseError,
  onFailure,
  onFinished,
}: UseOnSubmitProps<T, E, TAction>) {
  const [status, isPending, setStatus, resetStatus] = useStatus<E | string>();
  const onSubmit = async (e: TODO) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const p = payload || new FormData(e.currentTarget);
      if (validationSchema) {
        const parseResult = parseFormDataUsingSchema(p, validationSchema);
        if (!parseResult.success) {
          const msg = parseResult.error.issues.at(0)?.message || null;
          setStatus(msg);
          if (onParseError) {
            onParseError(parseResult.error);
          }
          return;
        }
      }

      const res = await action(p);
      if (res.success === false) {
        setStatus(res.error);
        if (onFailure) {
          await onFailure(res as FailureActionResponse<E>);
        }
      } else {
        setStatus('success');
        if (onSuccess) {
          await onSuccess(res as SuccessActionResponse<T>);
        }
      }
    } catch (err) {
      console.log(err.message);
      setStatus('error');
      if (onError) {
        onError(err);
      }
    } finally {
      resetStatus();
      if (onFinished) {
        onFinished();
      }
    }
  };

  return { onSubmit, isPending, status };
}
