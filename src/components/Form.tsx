export function Form({ children, ...props }: React.ComponentProps<'form'>) {
  return (
    <form
      {...props}
      className='flex flex-col gap-2 sm:w-[450px] xs:w-full'>
      {children}
    </form>
  );
}
