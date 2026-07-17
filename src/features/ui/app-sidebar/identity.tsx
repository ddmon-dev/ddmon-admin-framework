import { ProjectSymbol } from '@/shared/ui/logo';

export function AppSidebarIdentity() {
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg md:pt-4"
      // className='flex items-center gap-2.5 bg-sidebar-accent rounded-lg shadow-sm/10 p-2'
    >
      <ProjectSymbol linkToHome className="text-sm" />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium text-sm">DDmon Admin Framework</span>
        <span className="truncate text-xs text-muted-foreground">
          이동희의 어드민 프레임워크 데모입니다.
        </span>
      </div>
    </div>
  );
}
