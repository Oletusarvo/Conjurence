export const getParseResultErrorMessage = <E>(parseResult: TODO) =>
  parseResult.error.issues.at(0)?.message as E;
