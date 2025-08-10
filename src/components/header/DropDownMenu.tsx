type DropDownMenuProps = React.PropsWithChildren & {
  anchor?: number;
  fullHeight?: boolean;
};
export function DropDownMenu({ children, anchor = 0, ...props }: DropDownMenuProps) {
  return (
    <div
      {...props}
      style={{
        top: anchor,
      }}
      className='shadow-sm animate-slide-down flex flex-col gap-2 absolute left-0 w-full px-default py-4 bg-background-light border-b border-gray-600 -z-10'>
      {children}
    </div>
  );
}
