'use client';

import { ChevronsUpDown, LogOut, Shield, Pencil } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/shared/ui/sidebar';
import { Skeleton } from '@/shared/ui/skeleton';

import { signOut, useAuth, type User } from '@/features/auth';
import { UpdateProfileDialog } from '@/features/auth/ui/update-profile-dialog';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent/70 data-[state=open]:text-sidebar-accent-foreground data-[state=open]:shadow-sm'
            >
              <UserInfo user={user} />
              <ChevronsUpDown className='ml-auto size-4 group-data-[state=open]:text-primary transition-colors' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <UserInfo user={user} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UpdateProfileDialog>
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <Pencil />내 정보수정
              </DropdownMenuItem>
            </UpdateProfileDialog>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserInfo({ user }: { user: User | undefined }) {
  const initials = user?.id
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const role = user?.superAdmin === true ? '최고관리자' : '일반관리자';

  return (
    <div className='flex items-center gap-2 py-1.5 text-left text-sm'>
      <Avatar className='h-8 w-8 rounded-lg'>
        <AvatarFallback className='rounded-lg bg-primary text-primary-foreground dark:bg-primary-light dark:text-primary-light-foreground font-semibold text-lg transition-colors'>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className='grid gap-1 flex-1 text-left text-sm leading-tight'>
        <span className='truncate font-medium'>
          {!user ? <Skeleton className='h-4 w-32' /> : `${user?.name} (${user?.id})`}
        </span>
        <span className='flex items-center gap-1 truncate text-xs text-muted-foreground'>
          {!user ? (
            <Skeleton className='h-2.5 w-42' />
          ) : (
            <>
              <Shield className='size-3' />
              <span className='text-xs truncate leading-[1em]'>{role}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
