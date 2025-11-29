import Link from 'next/link';
import { FileText, Newspaper, HelpCircle, Users, ArrowRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/classnames';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
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
  },
];

export function QuickActions() {
  return (
    <section className='space-y-4'>
      <h2 className='text-sm font-medium text-muted-foreground'>빠른 액세스</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {actions.map(action => (
          <Link
            key={action.href}
            href={action.href}
            className='group'
          >
            <Card
              className={cn(
                'h-full transition-colors',
                'hover:border-foreground/20'
              )}
            >
              <CardHeader className='pb-4'>
                <div className='flex items-center justify-between'>
                  <action.icon className='size-5 text-muted-foreground' />
                  <ArrowRight
                    className={cn(
                      'size-4 text-muted-foreground',
                      'opacity-0 -translate-x-2',
                      'transition-all duration-200',
                      'group-hover:opacity-100 group-hover:translate-x-0'
                    )}
                  />
                </div>
                <CardTitle className='text-base'>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
