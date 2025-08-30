import { ReactNode } from 'react';

/**Hides the passed element based on show.
 * @deprecated
 */
export const hideIf = (element: ReactNode, show: boolean) => (!show ? element : null);
