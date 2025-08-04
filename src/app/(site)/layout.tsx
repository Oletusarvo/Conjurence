import { HeaderProvider } from '@/components/header/HeaderProvider';
import { MainMenuButton } from '@/components/header/MainMenuButton';

export default async function SiteLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <HeaderProvider>
        <MainMenuButton />
      </HeaderProvider>
      <main className='flex flex-1 py-2 overflow-y-scroll max-h-full h-full'>{children}</main>
    </>
  );
}
