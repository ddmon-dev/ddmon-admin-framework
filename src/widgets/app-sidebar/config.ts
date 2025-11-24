import { type MenuData } from './types';
import { Settings2, FileText, HelpCircle, Newspaper, Users } from 'lucide-react';

export const navigationConfig: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: MenuData[];
} = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: '템플릿',
      items: [
        {
          title: '템플릿',
          url: '#',
          icon: Settings2,
          isActive: true,
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
          isActive: true,
        },
        {
          title: '뉴스',
          url: '/manage-news',
          icon: Newspaper,
          isActive: true,
        },
        {
          title: 'FAQ',
          url: '/manage-faq',
          icon: HelpCircle,
          isActive: true,
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
          isActive: true,
        },
      ],
    },
  ],
};
