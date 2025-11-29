import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/widgets/app-sidebar/sidebar';
import { requireAuth, IdleLogoutProvider } from '@/features/auth';
import { AppHeaderProvider, AppHeader } from '@/shared/ui/app-header';
import { Container } from '@/shared/ui/container';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // 인증 확인
  await requireAuth();

  return (
    <IdleLogoutProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeaderProvider>
            <AppHeader />
            {children}
          </AppHeaderProvider>
        </SidebarInset>
      </SidebarProvider>
    </IdleLogoutProvider>
  );
}
