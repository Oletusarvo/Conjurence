import { useSessionStorage } from '@/hooks/use-session-storage';
import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { useState } from 'react';

const [StepContext, useStepContext] = createContextWithUseHook<ReturnType<typeof useStep>>(
  'useStepContext can only be called from within the scope of a StepContext!'
);

type StepProviderProps = React.PropsWithChildren & {
  initialStep?: number;
  max?: number;
};

export function StepProvider({ children, initialStep = 0, max = Infinity }: StepProviderProps) {
  const hook = useStep(initialStep, max);
  return <StepContext.Provider value={hook}>{children}</StepContext.Provider>;
}

export function useStep(initialStep: number = 0, max: number = Infinity) {
  const [current, setCurrent] = useState(initialStep);
  const forward = () => {
    if (current < max) {
      setCurrent(prev => prev + 1);
      return true;
    }
    return false;
  };

  const backward = () => {
    if (current > 0) {
      setCurrent(prev => prev - 1);
      return true;
    }
    return false;
  };

  const reset = () => setCurrent(0);

  const set = (step: number) => {
    if (step > max || step < 0) {
      return false;
    }
    setCurrent(step);
    return true;
  };

  return { current, forward, backward, reset, set };
}

export { useStepContext };
