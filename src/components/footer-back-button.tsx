'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**Renders the back-button on the app footer when on secondary routes. Uses the next/navigation router to go back to the previous page when clicked. */
export function FooterBackButton() {
  const router = useRouter();
  return (
    <button
      className='--round --ghost'
      onClick={() => router.push('/app/feed')}>
      <ArrowLeft />
    </button>
  );
}
