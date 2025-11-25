import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/widgets/app-sidebar/sidebar';
import { AppHeader } from '@/widgets/app-header';
import { ContentContainer } from '@/shared/ui/container';
import { requireAuth } from '@/features/auth';
import { IdleTimerProvider } from '@/features/auth/ui/idle-timer-provider';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // 인증 확인
  await requireAuth();

  return (
    <IdleTimerProvider timeout={60 * 60 * 1000}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <ContentContainer className='py-10 px-10'>{children}</ContentContainer>
        </SidebarInset>
      </SidebarProvider>
    </IdleTimerProvider>
  );
}
