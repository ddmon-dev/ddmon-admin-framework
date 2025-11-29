import { type MenuData } from './types';
import { Settings2, FileText, HelpCircle, Newspaper, Users } from 'lucide-react';

export const navigationConfig: {
  navMain: MenuData[];
} = {
  navMain: [
    {
      title: '템플릿',
      items: [
        {
          title: '템플릿',
          url: '#',
          icon: Settings2,
          items: [
            {
              title: '템플릿',
              url: '/template',
            },
          ],
        },
      ],
    },
    {
      title: '게시판',
      items: [
        {
          title: '공지사항',
          url: '/manage-notice',
          icon: FileText,
        },
        {
          title: '뉴스',
          url: '/manage-news',
          icon: Newspaper,
        },
        {
          title: 'FAQ',
          url: '/manage-faq',
          icon: HelpCircle,
        },
      ],
    },
    {
      title: '관리자',
      items: [
        {
          title: '관리자 계정 관리',
          url: '/manage-admin',
          icon: Users,
        },
      ],
    },
  ],
};
