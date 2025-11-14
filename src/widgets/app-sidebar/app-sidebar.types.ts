import { type LucideIcon } from 'lucide-react';

export interface MenuData {
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: MenuSubItem[];
}

export interface MenuSubItem {
  title: string;
  url: string;
}
