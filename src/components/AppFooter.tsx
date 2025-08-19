export function AppFooter({ children }) {
  return (
    <footer className='px-2 py-4 w-full flex items-center justify-center gap-8 border-t border-background-light-border z-20 bg-background-light'>
      {children}
    </footer>
  );
}
