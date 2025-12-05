import Link from 'next/link';
import {
  FileText,
  Newspaper,
  HelpCircle,
  Users,
  ArrowRight,
  SquareArrowOutUpRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/shared/utils/classnames';
import { Card } from '@/shared/ui/card';
import { RequireAuth } from '@/features/auth/ui/require-auth';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  requireSuperAdmin?: boolean;
  external?: boolean;
}

const actions: QuickAction[] = [
  {
    title: '공지사항',
    description: '공지사항 관리',
    href: '/manage-notice',
    icon: FileText,
  },
  {
    title: '뉴스',
    description: '뉴스 게시물 관리',
    href: '/manage-news',
    icon: Newspaper,
  },
  {
    title: 'FAQ',
    description: '자주 묻는 질문 관리',
    href: '/manage-faq',
    icon: HelpCircle,
  },
  {
    title: '관리자',
    description: '관리자 계정 관리',
    href: '/manage-admin',
    icon: Users,
    requireSuperAdmin: true,
  },
];

export function QuickActions() {
  return (
    <Card className='gap-2 px-6 lg:px-8 border-none bg-secondary/50 shadow-lg/6 lg:-mx-7'>
      <h2 className='text-lg uppercase tracking-[0.15em] text-muted-foreground'>Quick Actions</h2>
      <div className='-mx-4 grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-6 divide-y divide-secondary-foreground/10 lg:divide-none lg:gap-2'>
        {actions.map(action => (
          <RequireAuth
            key={action.href}
            requireSuper={action.requireSuperAdmin}
          >
            <Link
              href={action.href}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              className={cn(
                'group flex items-center gap-4 p-4',
                'transition-all duration-200',
                'hover:bg-background hover:shadow-sm/6',
                'rounded-none lg:rounded-lg break-keep'
              )}
            >
              <div className='shrink-0 size-10 flex items-center justify-center rounded-lg bg-muted/90 group-hover:bg-primary/10 transition-colors'>
                <action.icon className='size-5 text-muted-foreground group-hover:text-primary transition-colors' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-foreground'>{action.title}</p>
                {action.description && (
                  <p className='text-xs text-muted-foreground'>{action.description}</p>
                )}
              </div>
              {action.external ? (
                <SquareArrowOutUpRight
                  className={cn(
                    'size-4 text-muted-foreground shrink-0',
                    'opacity-0 -translate-x-2',
                    'transition-all duration-200',
                    'group-hover:opacity-100 group-hover:translate-x-0'
                  )}
                />
              ) : (
                <ArrowRight
                  className={cn(
                    'size-4 text-muted-foreground shrink-0',
                    'opacity-0 -translate-x-2',
                    'transition-all duration-200',
                    'group-hover:opacity-100 group-hover:translate-x-0'
                  )}
                />
              )}
            </Link>
          </RequireAuth>
        ))}
      </div>
    </Card>
  );
}
