'use client';

import { useClassName } from '@/hooks/useClassName';

export type StatusBadgeProps = {
  variant: 'active' | 'critical' | 'expired';
};

export function StatusBadge({ variant }: StatusBadgeProps) {
  const className = useClassName(
    'rounded-full w-2 h-2',
    variant === 'active' ? 'bg-green-400' : variant === 'critical' ? 'bg-yellow-500' : 'bg-red-500'
  );

  return <div className={className} />;
}
