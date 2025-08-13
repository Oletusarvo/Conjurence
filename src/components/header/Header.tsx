import { Ghost, Waypoints } from 'lucide-react';
import { name, version } from '@package';
import Link from 'next/link';
import { capitalize } from '@/util/capitalize';

export function Header({ children, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      {...props}
      className='py-4 px-default flex items-center w-full border-b border-background-light-border justify-between z-20 bg-background-light'>
      <Logo />
      <div className='flex items-center gap-4'>{children}</div>
    </header>
  );
}

export function Logo() {
  return (
    <Link
      href='/'
      className='flex gap-1 items-center text-gray-200 text-xs'>
      <span className='text-accent'>
        <Ghost />
      </span>
      <div className='flex items-baseline gap-1'>
        <h2
          id='logo'
          className='font-semibold tracking-wider text-[10px]'>
          {name}
        </h2>
        <small className='text-accent'>{version}</small>
      </div>
    </Link>
  );
}
