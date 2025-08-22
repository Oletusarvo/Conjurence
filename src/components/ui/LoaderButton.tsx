import { withLoader } from '@/hoc/withLoader';

export const LoaderButton = withLoader(({ children, ...props }: React.ComponentProps<'button'>) => (
  <button {...props}>{children}</button>
));
