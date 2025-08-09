import { createClassName } from '@/util/createClassName';

type SublabelProps = React.PropsWithChildren & {
  variant?: 'error' | 'success' | 'warning' | 'default';
};

export function Sublabel({ children, variant = 'default' }: SublabelProps) {
  const className = createClassName('sublabel', `--${variant}`);

  return <div className={className}>{children}</div>;
}
