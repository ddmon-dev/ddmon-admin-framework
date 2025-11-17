'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/shared/ui/button';

export function Categories({
  categories,
}: {
  categories: { title: string; components: React.ReactNode[] }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || categories[0].title;

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', category);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className='flex flex-col gap-2'>
      {categories.map(category => (
        <Button
          key={category.title}
          variant={category.title === currentCategory ? 'default' : 'outline'}
          onClick={() => handleCategoryClick(category.title)}
        >
          {category.title.charAt(0).toUpperCase() + category.title.slice(1)}
        </Button>
      ))}
    </div>
  );
}
