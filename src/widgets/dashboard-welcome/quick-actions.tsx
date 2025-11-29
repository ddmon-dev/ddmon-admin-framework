import Link from 'next/link';
import { FileText, Newspaper, HelpCircle, Users, ArrowRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/classnames';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const actions: QuickAction[] = [
  {
    title: '공지사항',
    description: '새 공지사항을 작성하거나 관리합니다',
    href: '/manage-notice',
    icon: FileText,
    color: 'blue',
  },
  {
    title: '뉴스',
    description: '뉴스 게시물을 작성하거나 관리합니다',
    href: '/manage-news',
    icon: Newspaper,
    color: 'green',
  },
  {
    title: 'FAQ',
    description: '자주 묻는 질문을 관리합니다',
    href: '/manage-faq',
    icon: HelpCircle,
    color: 'orange',
  },
  {
    title: '관리자',
    description: '관리자 계정을 관리합니다',
    href: '/manage-admin',
    icon: Users,
    color: 'purple',
  },
];

const colorVariants = {
  blue: 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20',
  green: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20',
  orange: 'bg-orange-500/10 text-orange-600 group-hover:bg-orange-500/20',
  purple: 'bg-violet-500/10 text-violet-600 group-hover:bg-violet-500/20',
};

export function QuickActions() {
  return (
    <section>
      <h2 className='text-lg font-semibold mb-4'>빠른 액세스</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {actions.map(action => (
          <Link
            key={action.href}
            href={action.href}
            className='group'
          >
            <div
              className={cn(
                'relative overflow-hidden rounded-xl border bg-card p-6',
                'transition-all duration-300 ease-out',
                'hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1',
                'hover:border-primary/20'
              )}
            >
              {/* 아이콘 */}
              <div
                className={cn(
                  'inline-flex items-center justify-center size-12 rounded-xl mb-4',
                  'transition-colors duration-300',
                  colorVariants[action.color]
                )}
              >
                <action.icon className='size-6' />
              </div>

              {/* 텍스트 */}
              <h3 className='font-semibold mb-1 flex items-center gap-2'>
                {action.title}
                <ArrowRight
                  className={cn(
                    'size-4 opacity-0 -translate-x-2',
                    'transition-all duration-300',
                    'group-hover:opacity-100 group-hover:translate-x-0'
                  )}
                />
              </h3>
              <p className='text-sm text-muted-foreground line-clamp-2'>
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
