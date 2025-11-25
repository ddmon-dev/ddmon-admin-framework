import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/widgets/app-sidebar/sidebar';
import { AppHeader } from '@/widgets/app-header';
import { ContentContainer } from '@/shared/ui/container';
import { requireAuth } from '@/features/auth';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // 인증 확인
  await requireAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <ContentContainer className='py-10 px-10'>{children}</ContentContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}
