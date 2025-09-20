export function EventOverviewContainer({ children }: React.PropsWithChildren) {
  return (
    <div className='flex flex-col bg-gradient-to-b from-background-light to-purple-900 w-full px-default py-4 border-b border-background-light-border items-start gap-4'>
      {children}
    </div>
  );
}
