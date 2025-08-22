'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type HighlightLinkProps = React.ComponentProps<typeof Link> & {};

/**Renders a link that gets highlighted when on the path that it links to. */
export function HighlightLink({ children, ...props }: HighlightLinkProps) {
  const pathname = usePathname();
  const selected = props.href.toString().split('?').at(0) === pathname;
  const className = [props.className, selected ? '--on-path' : ''].join(' ').trim();

  return (
    <Link
      {...props}
      className={className}>
      {children}
    </Link>
  );
}
