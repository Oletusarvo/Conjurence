import React from 'react';
import { ReactNode } from 'react';

export const hasMaxChildCount = (children: ReactNode, count: number) => {
  if (React.Children.count(children) > count) {
    throw new Error('Received more children than allowed!');
  }
};
