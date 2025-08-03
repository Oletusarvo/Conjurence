import { FC, JSX, ReactNode } from 'react';

/**Returns a new component that renders an alternate child when showAlternate is set to true. */
export function withAlternate(Component: TODO, replace?: boolean) {
  return ({
    children,
    showAlternate,
    alternate,
    ...props
  }: React.ComponentProps<typeof Component> & {
    showAlternate?: boolean;
    alternate?: ReactNode;
  }) => {
    if (replace) {
      return showAlternate ? alternate : <Component {...props}>{children}</Component>;
    }

    return <Component {...props}>{showAlternate ? alternate : children}</Component>;
  };
}
