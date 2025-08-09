'use client';

import { useDistance } from '@/features/distance/hooks/useDistance';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';

const [DistanceContext, useDistanceContext] = createContextWithUseHook<{
  distance: number;
  distancePending: boolean;
}>('useDistanceContext can only be called within the context of a DistanceContext!');

export function DistanceProvider({ children }: React.PropsWithChildren) {
  const { distance, isPending } = useDistance();
  return (
    <DistanceContext.Provider value={{ distance, distancePending: isPending }}>
      {children}
    </DistanceContext.Provider>
  );
}

export { useDistanceContext };
