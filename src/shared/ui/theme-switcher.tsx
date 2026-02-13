'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { Moon, Sun, Monitor } from 'lucide-react';

const THEMES = [
  {
    name: '라이트',
    value: 'light',
    icon: Sun,
  },
  {
    name: '다크',
    value: 'dark',
    icon: Moon,
  },
  {
    name: '시스템',
    value: 'system',
    icon: Monitor,
  },
] as const;

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">테마 전환</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map(({ name, value, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            <Icon className="mr-2 h-4 w-4" />
            <span>{name}</span>
            {value === theme && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration mismatch 방지를 위해 초기 렌더링 시 테마 값을 ''로 설정 (SSR 시점에서는 theme = '' 임)
  const currentTheme = mounted ? theme : '';

  return (
    <ToggleGroup
      type="single"
      value={currentTheme}
      className="flex items-center gap-0 w-full divide-x bg-background shadow-md dark:bg-sidebar-accent transition-colors"
    >
      {THEMES.map(({ name, value, icon: Icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          size="sm"
          onClick={() => setTheme(value)}
          className="w-full shrink hover:text-primary data-[state=on]:text-primary bg-transparent! transition-colors"
        >
          <span className="sr-only">{name}</span>
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
