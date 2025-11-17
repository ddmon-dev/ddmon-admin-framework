'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Categories } from './_components/categories';
import { DemoForm } from './_components/sections/form';
import { DemoList } from './_components/sections/list';

const categories = [
  {
    title: 'form',
    components: [<DemoForm />],
  },
  {
    title: 'table',
    components: [<DemoList />],
  },
];

function DemoPageContent() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || categories[0].title;

  return (
    <div className='grid grid-cols-[150px_1fr] gap-10 items-start container mx-auto max-w-3xl py-20'>
      <div className='sticky top-20'>
        <Categories categories={categories} />
      </div>
      {categories
        .find(category => category.title === currentCategory)
        ?.components.map(component => (
          <div key={component.key}>{component}</div>
        ))}
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DemoPageContent />
    </Suspense>
  );
}
