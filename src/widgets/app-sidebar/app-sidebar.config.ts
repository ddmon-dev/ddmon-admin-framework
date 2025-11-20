import { type MenuData } from './app-sidebar.types';
import { Settings2, FileText } from 'lucide-react';

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
      title: 'Demo',
      items: [
        {
          title: 'Demo',
          url: '#',
          icon: Settings2,
          isActive: true,
          items: [
            {
              title: 'Component Demo',
              url: '/demo',
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
      ],
    },
  ],
};
