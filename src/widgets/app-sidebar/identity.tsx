import { ProjectSymbol } from '@/shared/ui/logo';

export function AppSidebarIdentity() {
  return (
    <div className='flex items-center gap-2.5'>
      <ProjectSymbol
        linkToHome
        className='text-sm dark:bg-tertiary dark:text-tertiary-foreground'
      />
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <span className='truncate font-medium text-sm'>Admin Template</span>
        <span className='truncate text-xs text-muted-foreground'>어드민 대시보드 템플릿 입니다.</span>
      </div>
    </div>
  );
}
