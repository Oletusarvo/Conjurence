declare type TODO = any;
declare type ActionResponse<TData, TError extends string | void> =
  | {
      success: true;
      data?: TData;
    }
  | {
      success: false;
      error?: TError;
    };
