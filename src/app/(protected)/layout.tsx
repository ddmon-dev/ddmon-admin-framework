import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/widgets/app-sidebar/sidebar';
import { AppHeader } from '@/widgets/app-header';
import { ContentContainer } from '@/shared/ui/container';
import { requireAuth } from '@/features/auth';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <AppHeader />
        <ContentContainer className='py-10 px-10'>{children}</ContentContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}
