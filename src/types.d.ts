declare type TODO = any;
declare type SuccessActionResponse<TData> = {
  success: true;
  data?: TData;
};

declare type FailureActionResponse<TError extends string> = {
  success: false;
  error?: TError;
};

declare type ActionResponse<TData, TError extends string | void> =
  | SuccessActionResponse<TData>
  | FailureActionResponse<TError>;
