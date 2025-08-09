import { useClassName } from '@/hooks/useClassName';
import { Check, CircleAlert, OctagonX, TriangleAlert } from 'lucide-react';

type NoticeProps = React.PropsWithChildren & {
  variant: 'success' | 'error' | 'default' | 'warning';
};

export function Notice({ children, variant = 'default' }: NoticeProps) {
  const className = useClassName('notice flex gap-2', `--${variant}`, '--contained');
  return (
    <div className={className}>
      <div className='flex items-start'>
        {variant === 'success' ? (
          <Check color='var(--color-green-100)' />
        ) : variant === 'warning' ? (
          <TriangleAlert color='var(--color-yellow-100)' />
        ) : variant === 'error' ? (
          <OctagonX color='var(--color-red-100)' />
        ) : (
          <CircleAlert />
        )}
      </div>
      {children}
    </div>
  );
}
