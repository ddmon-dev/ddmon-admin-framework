'use client';

import { useRouter } from 'next/navigation';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { Button } from '@/shared/ui/button';

export function Menu({ items }: { items: { title: string; components: React.ReactNode[] }[] }) {
  const router = useRouter();
  const { get } = useQueryParams();
  const currentMenu = get('menu') || items[0].title;

  return (
    <div className='flex flex-col gap-2'>
      {items.map(item => (
        <Button
          key={item.title}
          variant={item.title === currentMenu ? 'default' : 'outline'}
          onClick={() => router.push(`?menu=${item.title}`)}
        >
          {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
        </Button>
      ))}
    </div>
  );
}
