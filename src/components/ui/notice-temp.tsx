import { useClassName } from '@/hooks/use-class-name';
import { Check, CircleAlert, OctagonX, TriangleAlert } from 'lucide-react';

type NoticeProps = React.PropsWithChildren & {
  variant: 'success' | 'error' | 'default' | 'warning';
};

export function Notice({ children, variant = 'default' }: NoticeProps) {
  const className = useClassName(
    'notice flex gap-2 w-full',
    variant !== 'default' ? `--${variant}` : '--theme',
    '--contained'
  );
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
      <div className='text-left text-sm'>{children}</div>
    </div>
  );
}
