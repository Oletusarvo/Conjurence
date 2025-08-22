import React, { ReactElement, useMemo } from 'react';

/**Clones its children, passing the provided props to each. */
export function PassProps<T>({ children, ...props }: React.PropsWithChildren & T) {
  const enhanced = useMemo(() => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        const childProps = child.props as any;
        return React.cloneElement(child as any, {
          ...childProps,
          ...props,
          onClick: e => {
            if (childProps.onClick) {
              childProps.onClick(e);
            }

            if ((props as any).onClick) {
              (props as any).onClick(e);
            }
          },
        });
      }
      return child;
    });
  }, [props, children]);
  return enhanced;
}
