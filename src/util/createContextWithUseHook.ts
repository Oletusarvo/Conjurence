import { createContext, useContext } from 'react';

export function createContextWithUseHook<T extends {}>(errorMsg?: string) {
  const Ctx = createContext<T | null>(null);
  const useContextHook = () => {
    const ctx = useContext(Ctx);
    if (!ctx) {
      throw new Error(
        errorMsg ||
          'A useContext-hook created with createContextWithUseHook was called outside of the scope of its context! Please provide an error message for identification.'
      );
    }
    return ctx;
  };
  return [Ctx, useContextHook] as const;
}
