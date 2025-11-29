import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/shared/ui/app-sidebar/sidebar';
import { requireAuth, IdleLogoutProvider } from '@/features/auth';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // 인증 확인
  await requireAuth();

  return (
    <IdleLogoutProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </IdleLogoutProvider>
  );
}
