import { cn } from '@/shared/utils/classnames';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/shared/ui/empty';

interface StatusLayoutProps {
  code: string;
  title: string;
  description: React.ReactNode;
  actions: React.ReactNode;
  fullScreen?: boolean;
}

export function StatusLayout({
  code,
  title,
  description,
  actions,
  fullScreen = false,
}: StatusLayoutProps) {
  return (
    <Empty className={cn('border-0 gap-8', fullScreen ? 'min-h-screen' : 'flex-1')}>
      <EmptyHeader>
        <EmptyMedia className='mb-4'>
          <span className='text-8xl font-secondary font-medium tracking-tighter text-muted-foreground/50'>
            {code}
          </span>
        </EmptyMedia>
        <EmptyTitle className='text-2xl'>{title}</EmptyTitle>
        <EmptyDescription className='text-lg mt-2 break-keep'>{description}</EmptyDescription>
      </EmptyHeader>

      {actions && <EmptyContent className='[&_button,&_a]:w-32'>{actions}</EmptyContent>}
    </Empty>
  );
}
