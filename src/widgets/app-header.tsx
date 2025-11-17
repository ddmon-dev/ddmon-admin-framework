import { cn } from '@/shared/lib/utils/classnames';
import { ContentContainer } from '@/shared/ui/container';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { AppBreadcrumb } from '@/widgets/app-breadcrumb/app-breadcrumb';

export function AppHeader() {
  return (
    <header className={cn('border-b')}>
      <ContentContainer className={cn('py-3 flex items-center gap-2')}>
        <SidebarTrigger className={cn('-ml-1')} />
        <Separator
          orientation='vertical'
          className={cn('data-[orientation=vertical]:h-4 mx-2')}
        />
        <AppBreadcrumb />
      </ContentContainer>
    </header>
  );
}
