import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Socialize',
  description:
    'An app for creating small local events, like a game of cards, or hangout in the park, for other users to find and join.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
        />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
          rel='stylesheet'></link>
      </head>

      <body className='flex flex-col antialiazed w-full max-h-screen h-screen overflow-y-hidden'>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position='bottom-center' />
      </body>
    </html>
  );
}
