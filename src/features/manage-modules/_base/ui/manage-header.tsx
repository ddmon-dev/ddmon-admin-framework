'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/shared/utils/classnames';
import { SearchBar } from '@/shared/ui/data-list';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { useAppHeader } from '@/shared/ui/app-header';
import { CreateButton } from './create-button';

interface ManageModuleHeaderProps {
  moduleName: string;
  headerAddons?: React.ReactNode;
}

export function ManageModuleHeader({ moduleName, headerAddons }: ManageModuleHeaderProps) {
  const [open, setOpen] = useState(false);
  const hasFilters = !!headerAddons;

  useAppHeader({
    title: `${moduleName} 관리`,
    topLeft: hasFilters ? (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='secondary' size='icon' className='md:hidden'>
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
          <Button onClick={() => setOpen(false)} className='w-full mt-4'>
            닫기
          </Button>
        </DialogContent>
      </Dialog>
    ) : undefined,
    topRight: <CreateButton>{moduleName} 생성</CreateButton>,
    bottomLeft: hasFilters ? (
      <div className={cn('hidden md:flex items-center gap-2')}>{headerAddons}</div>
    ) : undefined,
    bottomRight: hasFilters ? (
      <div className='hidden md:block'>
        <SearchBar />
      </div>
    ) : undefined,
    className: cn('[&_h1]:hidden [&_h1]:md:block'),
  });

  return null;
}
