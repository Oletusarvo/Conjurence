'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**Renders the back-button on the app footer when on secondary routes. Uses the next/navigation router to go back to the previous page when clicked. */
export function FooterBackButton() {
  const router = useRouter();
  return (
    <button
      className='--no-default'
      onClick={() => router.back()}>
      <ArrowLeft />
    </button>
  );
}
