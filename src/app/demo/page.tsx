'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Menu } from './_components/menu';
import { DemoForm } from './_components/sections/form';
import { DemoList } from './_components/sections/list';
import { DemoEditor } from './_components/sections/editor';

const menuItems = [
  {
    title: 'form',
    components: [<DemoForm />],
  },
  {
    title: 'table',
    components: [<DemoList />],
  },
  {
    title: 'editor',
    components: [<DemoEditor />],
  },
];

function DemoPageContent() {
  const searchParams = useSearchParams();
  const currentMenu = searchParams.get('menu') || menuItems[0].title;

  return (
    <div className='grid grid-cols-[150px_1fr] gap-10 items-start container mx-auto max-w-3xl py-20'>
      <div className='sticky top-20'>
        <Menu items={menuItems} />
      </div>
      {menuItems
        .find(item => item.title === currentMenu)
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
