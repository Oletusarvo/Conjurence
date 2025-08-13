import { createClassName } from '@/util/createClassName';

type TabProps = React.PropsWithChildren & {
  selected?: boolean;
};

export function Tab({ children, selected, ...props }: TabProps) {
  const className = createClassName(
    'w-full px-2 py-2 flex items-center justify-center uppercase font-semibold text-[12px] cursor-pointer border-b',
    selected ? 'border-accent' : 'border-transparent'
  );

  return (
    <div
      {...props}
      className={className}>
      {children}
    </div>
  );
}
