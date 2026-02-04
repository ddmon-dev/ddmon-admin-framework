import { type MenuData } from './types';
import { FileText, Users, AlertCircle, ServerCrash, ShieldX, MessageSquare, AppWindow } from 'lucide-react';

interface MenuConfig {
  navMain: MenuData[];
}

export const navigationConfig: MenuConfig = {
  navMain: [
    {
      title: '샘플',
      items: [
        {
          title: '404 not found',
          url: '/404',
          icon: AlertCircle,
        },
        {
          title: '500 internal server error',
          url: '/error-test',
          icon: ServerCrash,
        },
        {
          title: 'unauthorized',
          url: '/unauthorized',
          icon: ShieldX,
        },
      ],
    },
    {
      title: '게시판',
      items: [
        {
          title: '게시판 관리',
          url: '#',
          icon: FileText,
          items: [
            {
              title: '공지사항',
              url: '/notices',
            },
            {
              title: '뉴스',
              url: '/news',
            },
            {
              title: 'FAQ',
              url: '/faqs',
            },
          ],
        },
        {
          title: '문의 관리',
          url: '/inquiries',
          icon: MessageSquare,
        },
      ],
    },
    {
      title: '사이트 관리',
      items: [
        {
          title: '팝업 관리',
          url: '/popups',
          icon: AppWindow,
        },
      ],
    },
    {
      title: '관리자',
      requireSuper: true,
      items: [
        {
          title: '관리자 계정 관리',
          url: '/admins',
          icon: Users,
        },
      ],
    },
  ],
};
