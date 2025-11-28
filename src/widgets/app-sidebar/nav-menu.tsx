'use client';

import { ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
      {data.map(group => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map(item => (
              <MenuItem
                key={item.title}
                item={item}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </nav>
  );
}

function MenuItem({ item }: { item: MenuItemType }) {
  const pathname = usePathname();
  const hasSubItems = item.items && item.items.length > 0;

  const isActiveUrl = (url: string) => pathname.startsWith(url);
  const hasActiveChild = (items?: MenuSubItem[]) => items?.some(subItem => isActiveUrl(subItem.url)) ?? false;

  if (hasSubItems) {
    return (
      <Collapsible
        asChild
        defaultOpen={hasActiveChild(item.items)}
        className='group/collapsible'
      >
        <SidebarMenuItem className='rounded-md data-[state=closed]:hover:bg-sidebar-accent data-[state=closed]:hover:shadow-sm/5 data-[state=open]:bg-sidebar-accent data-[state=open]:shadow-sm data-[state=open]:pt-1 data-[state=open]:pb-2'>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} className='hover:bg-transparent hover:shadow-none'>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map(subItem => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActiveUrl(subItem.url)}
                  >
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
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActiveUrl(item.url)}
      >
        <Link href={item.url}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          <ArrowRight className='ml-auto' />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
