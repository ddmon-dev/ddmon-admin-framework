'use client';

import { ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { RequireAuth } from '@/features/auth';
import { cn } from '@/shared/utils/classnames';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/ui/sidebar';
import { type MenuData, type MenuItem as MenuItemType, type MenuSubItem } from './types';

export function NavMenu({ data }: { data: MenuData[] }) {
  return (
    <nav className={cn('flex flex-col gap-2')}>
      {data.map((group) => (
        <MenuGroup key={group.title} group={group} />
      ))}
    </nav>
  );
}

function MenuGroup({ group }: { group: MenuData }) {
  const content = (
    <SidebarGroup>
      <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
      <SidebarMenu>
        {group.items.map((item) => (
          <MenuItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );

  if (group.requireSuper) {
    return (
      <RequireAuth requireSuper showLoading={false}>
        {content}
      </RequireAuth>
    );
  }

  return content;
}

function MenuItem({ item }: { item: MenuItemType }) {
  const pathname = usePathname();
  const hasSubItems = item.items && item.items.length > 0;

  const isActiveUrl = (url: string) => pathname.startsWith(url);
  const hasActiveChild = (items?: MenuSubItem[]) =>
    items?.some((subItem) => isActiveUrl(subItem.url)) ?? false;

  const content = hasSubItems ? (
    <Collapsible asChild defaultOpen={hasActiveChild(item.items)} className="group/collapsible">
      <SidebarMenuItem className="rounded-md data-[state=closed]:hover:bg-sidebar-accent data-[state=closed]:hover:shadow-sm/5 data-[state=open]:bg-sidebar-accent data-[state=open]:shadow-sm data-[state=open]:pt-1 data-[state=open]:pb-2">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className="hover:bg-transparent hover:shadow-none"
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild isActive={isActiveUrl(subItem.url)}>
                  <Link href={subItem.url}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  ) : (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActiveUrl(item.url)}>
        <Link href={item.url}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          <ArrowRight className="ml-auto" />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  if (item.requireSuper) {
    return (
      <RequireAuth requireSuper showLoading={false}>
        {content}
      </RequireAuth>
    );
  }

  return content;
}
