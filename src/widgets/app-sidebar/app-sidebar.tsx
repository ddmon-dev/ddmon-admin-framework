'use client';

import { cn } from '@/shared/lib/utils/classnames';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/shared/ui/sidebar';
import { AppSidebarIdentity } from '@/widgets/app-sidebar/app-sidebar-identity';
import { NavMenu } from '@/widgets/app-sidebar/app-sidebar-nav-menu';
import { NavUser } from '@/widgets/app-sidebar/app-sidebar-nav-user';
import { ThemeToggle } from '@/shared/ui/theme-switcher';

import { navigationConfig } from '@/widgets/app-sidebar/app-sidebar.config';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible='offcanvas'
      variant='inset'
      {...props}
    >
      <SidebarHeader>
        <AppSidebarIdentity />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu data={navigationConfig.navMain} />
      </SidebarContent>
      <SidebarFooter className='gap-2 pt-6'>
        <div className={cn('px-0')}>
          <ThemeToggle />
        </div>
        <NavUser user={navigationConfig.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
