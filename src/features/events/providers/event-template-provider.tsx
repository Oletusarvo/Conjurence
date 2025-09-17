'use client';

import { createContextWithUseHook } from '@/util/create-context-with-use-hook';
import { TEvent } from '../schemas/event-schema';

const [EventTemplateContext, useEventTemplateContext] = createContextWithUseHook<{
  template?: TEvent;
}>('useEventTemplateContext can only be called within the scope of an EventTemplateContext!');

type TemplateProviderProps = React.PropsWithChildren & {
  initialTemplate?: any;
};

export function EventTemplateProvider({ children, initialTemplate }: TemplateProviderProps) {
  return (
    <EventTemplateContext.Provider value={{ template: initialTemplate }}>
      {children}
    </EventTemplateContext.Provider>
  );
}

export { useEventTemplateContext };
