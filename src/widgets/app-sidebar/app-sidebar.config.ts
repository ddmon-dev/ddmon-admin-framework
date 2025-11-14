import { type MenuData } from './app-sidebar.types';
import { Settings2 } from 'lucide-react';

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
      title: 'Settings',
      items: [
        {
          title: 'Settings',
          url: '#',
          icon: Settings2,
          isActive: true,
          items: [
            {
              title: 'Admin Users',
              url: '/settings/admin-accounts',
            },
            {
              title: 'App Settings',
              url: '/settings/app-settings',
            },
          ],
        },
      ],
    },
    {
      title: 'Settings2',
      items: [
        {
          title: 'Settings22',
          url: '#',
          icon: Settings2,
          isActive: true,
        },
      ],
    },
  ],
};
