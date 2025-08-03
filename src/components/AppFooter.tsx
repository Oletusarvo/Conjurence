export function AppFooter({ children }: React.PropsWithChildren) {
  return (
    <footer className='px-2 py-4 w-full flex items-center justify-center gap-8 border-t border-gray-600 z-20 bg-background-light'>
      {children}
    </footer>
  );
}
