'use client';

import { ChevronRight, ArrowRight } from 'lucide-react';

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
import Link from 'next/link';
import { type MenuData, type MenuItem } from './types';

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

function MenuItem({ item }: { item: MenuItem }) {
  const hasSubItems = item.items && item.items.length > 0;

  if (hasSubItems) {
    return (
      <Collapsible
        asChild
        defaultOpen={item.isActive}
        className='group/collapsible'
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map(subItem => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
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
      <SidebarMenuButton asChild>
        <Link href={item.url}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          <ArrowRight className='ml-auto' />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
