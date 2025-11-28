import { cn } from '@/shared/utils/classnames';
import { Container } from '@/shared/ui/container';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { SearchBar } from '@/shared/ui/data-list';
import { CreateButton } from './create-button';

interface ManageModuleHeaderProps {
  moduleName: string;
  headerAddons?: React.ReactNode;
}

export function ManageModuleHeader({ moduleName, headerAddons }: ManageModuleHeaderProps) {
  return (
    <header className={cn('border-b sticky top-0 z-10 bg-background rounded-t-xl py-3')}>
      <Container className={cn('grid gap-2')}>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />
          <Separator
            orientation='vertical'
            className={cn('data-[orientation=vertical]:h-4 mx-2')}
          />
          <h1 className='text-xl font-semibold hidden md:block'>{moduleName} 관리</h1>
          <div className='flex items-center gap-2 ml-auto'>
            <CreateButton>{moduleName} 생성</CreateButton>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {headerAddons}
          <div className='ml-auto'>
            <SearchBar />
          </div>
        </div>
      </Container>
    </header>
  );
}
