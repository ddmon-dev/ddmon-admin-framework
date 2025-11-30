'use client';

import { APP_CONFIG } from '@/app.config';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/shared/ui/sidebar';
import { AppSidebarIdentity } from '@/features/ui/app-sidebar/identity';
import { NavMenu } from '@/features/ui/app-sidebar/nav-menu';
import { NavUser } from '@/features/ui/app-sidebar/nav-user';
import { ThemeToggle } from '@/shared/ui/theme-switcher';

import { navigationConfig } from '@/features/ui/app-sidebar/config';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible='offcanvas'
      variant={APP_CONFIG.UI.SIDEBAR.VARIANT}
      {...props}
    >
      <SidebarHeader>
        <AppSidebarIdentity />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu data={navigationConfig.navMain} />
      </SidebarContent>
      <SidebarFooter className='gap-2 pt-6'>
        <NavUser />
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
