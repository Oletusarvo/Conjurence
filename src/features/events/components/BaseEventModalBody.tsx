import { useClassName } from '@/hooks/useClassName';

export function BaseEventModalBody({ children }: React.PropsWithChildren) {
  const modalBodyClassName = useClassName('flex flex-col gap-4 h-full');
  return <div className={modalBodyClassName}>{children}</div>;
}
