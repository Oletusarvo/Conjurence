import { ReactNode } from 'react';

export const hideIf = (element: ReactNode, show: boolean) => (!show ? element : null);
