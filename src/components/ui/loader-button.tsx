import { withLoader } from '@/hoc/with-loader';

export const LoaderButton = withLoader(({ children, ...props }: React.ComponentProps<'button'>) => (
  <button {...props}>{children}</button>
));
