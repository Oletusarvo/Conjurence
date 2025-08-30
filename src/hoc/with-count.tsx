export function withCount(Component) {
  return ({
    children,
    count,
    showOnZero = true,
    ...props
  }: React.ComponentProps<typeof Component> & { count: number; showOnZero?: boolean }) => {
    return (
      <div className='relative flex'>
        <Component {...props}>{children}</Component>
        {count != 0 || showOnZero ? (
          <div className='bg-accent rounded-full w-[18px] h-[18px] z-10 absolute text-black flex items-center justify-center text-sm -bottom-2 left-4 font-semibold'>
            <span>{count}</span>
          </div>
        ) : null}
      </div>
    );
  };
}
