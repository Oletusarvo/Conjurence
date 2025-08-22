import { createClassName } from '@/util/createClassName';

export function Form({ children, ...props }: React.ComponentProps<'form'>) {
  return (
    <form
      {...props}
      className='flex flex-col gap-2 sm:w-[450px] xs:w-full'>
      {children}
    </form>
  );
}

export function FormContainer({
  children,
  centered,
}: React.PropsWithChildren & { centered?: boolean }) {
  const className = createClassName(
    'flex flex-col gap-2 xs:w-full sm:w-auto flex-1 pb-2',
    centered ? 'justify-center' : ''
  );
  return <div className={className}>{children}</div>;
}
