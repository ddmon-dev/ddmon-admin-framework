import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/widgets/app-sidebar/app-sidebar';
import { AppHeader } from '@/widgets/app-header';
import { ContentContainer } from '@/shared/ui/container';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <ContentContainer className='py-4'>{children}</ContentContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}
