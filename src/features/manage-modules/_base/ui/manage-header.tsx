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
import { CategoryButtonGroup } from '@/shared/ui/category-button-group';
import { APP_CONFIG } from '@/app.config';
import { CreateButton } from './create-button';

const langOptions = APP_CONFIG.LANG.CODES.map((code) => ({
  value: code,
  label: APP_CONFIG.LANG.LABELS[code],
}));

interface ManageModuleHeaderProps {
  title?: string;
  moduleName: string;
  headerAddons?: React.ReactNode;
  headerSearchBar?: React.ReactNode;
  createButtonLabel?: string;
  hideCreateButton?: boolean;
  showLangFilter?: boolean;
}

export function ManageModuleHeader({
  title,
  moduleName,
  headerAddons,
  headerSearchBar,
  createButtonLabel,
  hideCreateButton,
  showLangFilter = true,
}: ManageModuleHeaderProps) {
  const langFilter = showLangFilter ? (
    <CategoryButtonGroup
      options={langOptions}
      paramKey="lang"
      showAllOption={false}
      defaultValue={APP_CONFIG.LANG.DEFAULT}
    />
  ) : null;
  return (
    <header className={cn('border-b sticky top-0 z-10 bg-background rounded-t-xl py-1.5 md:py-4')}>
      <Container className={cn('grid gap-3 px-1.5 md:px-4')}>
        <div className="flex items-center gap-2">
          <SidebarTrigger />

          <Separator
            orientation="vertical"
            className={cn('data-[orientation=vertical]:h-4 mx-2 hidden md:block')}
          />

          <h1 className="text-xl font-semibold hidden md:block">
            {title ? title : `${moduleName} 관리`}
          </h1>
          <div className="flex items-center gap-1 ml-auto">
            {/* 모바일: 필터 다이얼로그 버튼 */}
            <FilterDialog
              langFilter={langFilter}
              headerAddons={headerAddons}
              headerSearchBar={headerSearchBar}
            />
            {!langFilter && !headerAddons && !headerSearchBar && (
              <div className="hidden md:block">
                <SearchBar />
              </div>
            )}
            {!hideCreateButton && (
              <CreateButton>{createButtonLabel ?? `${moduleName} 생성`}</CreateButton>
            )}
          </div>
        </div>

        {/* 데스크톱: 필터 및 검색 표시 */}
        {(langFilter || headerAddons || headerSearchBar) && (
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {langFilter}
            {headerAddons}
            <div className="ml-auto">{headerSearchBar ?? <SearchBar />}</div>
          </div>
        )}
      </Container>
    </header>
  );
}

function FilterDialog({
  langFilter,
  headerAddons,
  headerSearchBar,
}: {
  langFilter?: React.ReactNode;
  headerAddons?: React.ReactNode;
  headerSearchBar?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (!langFilter && !headerAddons && !headerSearchBar) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="md:hidden">
          <Filter className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>필터 및 검색</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4 **:ml-0!">
          {langFilter}
          {headerAddons}
          {headerSearchBar ?? <SearchBar />}
        </div>
        <Button onClick={() => setOpen(false)} className="w-full mt-4">
          닫기
        </Button>
      </DialogContent>
    </Dialog>
  );
}
