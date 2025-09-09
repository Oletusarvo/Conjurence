import { AppFooter } from '@/components/app-footer';
import { FooterBackButton } from '@/components/footer-back-button';
import { RoundButton } from '@/components/ui/round-button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Renders its children with an app footer with a back-arrow instead of the main links.
 * Intended for pages not fitting under the main routes; like event-creation and rating.
 * Notice: This used to render a footer-bar with a back-arrow, which has been removed in favour of handling navigation on the pages themselves.
 * @param param0
 * @returns
 */
export default async function AppSecondaryLayout({ children }) {
  return (
    <>
      <main className='flex flex-col flex-1 overflow-y-scroll max-h-full'>{children}</main>
    </>
  );
}
