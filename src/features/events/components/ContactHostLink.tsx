import Link from 'next/link';

export function ContactHostLink({ hostInfo }) {
  const url = hostInfo.messenger
    ? `https://m.me/${hostInfo.messenger}`
    : hostInfo.whatsapp
    ? `https://wa.me/${hostInfo.whatsapp}`
    : null;
  return (
    url && (
      <Link
        href={url}
        className='text-accent text-sm font-semibold'
        target='_blank'>
        contact host
      </Link>
    )
  );
}
