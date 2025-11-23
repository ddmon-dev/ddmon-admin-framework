'use client';

import { cn } from '@/shared/lib/utils/classnames';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/shared/ui/sidebar';
import { AppSidebarIdentity } from '@/widgets/app-sidebar/identity';
import { NavMenu } from '@/widgets/app-sidebar/nav-menu';
import { NavUser } from '@/widgets/app-sidebar/nav-user';
import { ThemeToggle } from '@/shared/ui/theme-switcher';
import type { AdminUser } from '@/features/auth/types';

import { navigationConfig } from '@/widgets/app-sidebar/config';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: AdminUser;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
