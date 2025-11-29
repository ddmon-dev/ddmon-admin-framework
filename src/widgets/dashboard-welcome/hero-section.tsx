'use client';

import { useSession } from 'next-auth/react';

function formatDate(): string {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export function HeroSection() {
  const { data: session } = useSession();
  const userName = session?.user?.name || '관리자';

  return (
    <section className='space-y-1'>
      <p className='text-sm text-muted-foreground'>{formatDate()}</p>
      <h1 className='text-2xl font-semibold tracking-tight'>
        안녕하세요, {userName}님.
      </h1>
    </section>
  );
}
