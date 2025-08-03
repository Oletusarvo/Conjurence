import { Waypoints } from 'lucide-react';
import { name } from '@package';
import Link from 'next/link';

export function Header({ children, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      {...props}
      className='py-4 px-2 flex items-center w-full border-b border-gray-600 justify-between z-20 bg-background-light'>
      <Logo />
      <div className='flex items-center gap-4'>{children}</div>
    </header>
  );
}

export function Logo() {
  return (
    <Link
      href='/'
      className='flex gap-2 items-center text-gray-200 text-xs'>
      <span className='text-accent'>
        <Waypoints />
      </span>
      <div className='flex items-baseline gap-1'>
        <h2
          id='logo'
          className='font-semibold tracking-wider text-[10px]'>
          {name}
        </h2>
        <small className='text-accent'>Beta</small>
      </div>
    </Link>
  );
}
