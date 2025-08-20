import { AppFooter } from '@/components/AppFooter';
import { FooterBackButton } from '@/components/FooterBackButton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Renders its children with an app footer with a back-arrow instead of the main links.
 * Intended for pages not fitting under the main routes; like event-creation and rating.
 * @param param0
 * @returns
 */
export default async function AppSecondaryLayout({ children }) {
  return (
    <>
      <main className='flex flex-col flex-1 overflow-y-scroll max-h-full'>{children}</main>
      <AppFooter>
        <FooterBackButton />
      </AppFooter>
    </>
  );
}
