import { Spinner } from '@/components/ui/Spinner';
import { withAlternate } from './withAlternate';

/**A wrapper around withAlternate. Renders a spinner when the loading-prop is set to true. */
export function withLoader(Component: any) {
  return ({
    children,
    loading,
    ...props
  }: React.PropsWithChildren & { [x: string]: any; loading?: boolean }) => {
    const EnhancedComponent = withAlternate(Component);
    return (
      <EnhancedComponent
        {...props}
        showAlternate={loading}
        alternate={<Spinner />}>
        {children}
      </EnhancedComponent>
    );
  };
}
