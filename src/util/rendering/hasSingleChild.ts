import React from 'react';
import { ReactNode } from 'react';

/**Counts the passed children and throws an error if there are more than the count. */
export const hasMaxChildCount = (children: ReactNode, count: number) => {
  if (React.Children.count(children) > count) {
    throw new Error('Received more children than allowed!');
  }
};
