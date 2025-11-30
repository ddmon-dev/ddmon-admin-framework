import { type MenuData } from './types';
import { Settings2, FileText, Users, AlertCircle, ServerCrash, ShieldX } from 'lucide-react';

interface MenuConfig {
  navMain: MenuData[];
}

export const navigationConfig: MenuConfig = {
  navMain: [
    {
      title: '샘플',
      items: [
        {
          title: '관리모듈 템플릿',
          url: '/template',
          icon: Settings2,
        },
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
              url: '/manage-notice',
            },
            {
              title: '뉴스',
              url: '/manage-news',
            },
            {
              title: 'FAQ',
              url: '/manage-faq',
            },
          ],
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
