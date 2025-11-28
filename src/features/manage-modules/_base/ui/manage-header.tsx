'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/shared/utils/classnames';
import { Container } from '@/shared/ui/container';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { SearchBar } from '@/shared/ui/data-list';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { CreateButton } from './create-button';

interface ManageModuleHeaderProps {
  moduleName: string;
  headerAddons?: React.ReactNode;
}

export function ManageModuleHeader({ moduleName, headerAddons }: ManageModuleHeaderProps) {
  const [open, setOpen] = useState(false);
  const hasFilters = !!headerAddons;

  return (
    <header className={cn('border-b sticky top-0 z-10 bg-background rounded-t-xl py-4')}>
      <Container className={cn('grid gap-2')}>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />

          <Separator
            orientation='vertical'
            className={cn('data-[orientation=vertical]:h-4 mx-2 hidden md:block')}
          />

          {/* 모바일: 필터 다이얼로그 버튼 */}
          {hasFilters && (
            <Dialog
              open={open}
              onOpenChange={setOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant='secondary'
                  size='icon'
                  className='md:hidden'
                >
                  <Filter className='size-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>필터 및 검색</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4 pt-4'>
                  {headerAddons}
                  <SearchBar />
                </div>
                <Button
                  onClick={() => setOpen(false)}
                  className='w-full mt-4'
                >
                  닫기
                </Button>
              </DialogContent>
            </Dialog>
          )}
          <h1 className='text-xl font-semibold hidden md:block'>{moduleName} 관리</h1>
          <div className='flex items-center gap-2 ml-auto'>
            <CreateButton>{moduleName} 생성</CreateButton>
          </div>
        </div>

        {/* 데스크톱: 필터 및 검색 표시 */}
        <div className='hidden md:flex items-center gap-2'>
          {headerAddons}
          <div className='ml-auto'>
            <SearchBar />
          </div>
        </div>
      </Container>
    </header>
  );
}
