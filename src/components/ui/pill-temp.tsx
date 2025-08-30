import { createClassName } from '@/util/create-class-name';

type PillProps = React.PropsWithChildren & {
  variant?: 'contained' | 'outlined';
  color?: 'accent';
  size?: 'small';
};
export function Pill({ children, color, variant = 'contained', size }: PillProps) {
  const className = createClassName(
    'pill',
    `--${variant}`,
    color ? `--${color}` : '--white',
    size && `--${size}`,
    size === 'small' ? 'text-sm' : 'text-base'
  );

  return <div className={className}>{children}</div>;
}
