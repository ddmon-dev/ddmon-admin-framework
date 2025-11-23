import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/widgets/app-sidebar/sidebar';
import { AppHeader } from '@/widgets/app-header';
import { ContentContainer } from '@/shared/ui/container';
import { auth, AUTH_PATHS } from '@/features/auth';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect(AUTH_PATHS.SIGN_IN);
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <AppHeader />
        <ContentContainer className='py-10 px-10'>{children}</ContentContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}
