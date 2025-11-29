'use client';

import { useSession } from 'next-auth/react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

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
    <section className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 md:p-12'>
      {/* 배경 장식 */}
      <div className='absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl' />
      <div className='absolute -bottom-24 -left-24 size-64 rounded-full bg-primary/5 blur-3xl' />

      <div className='relative z-10'>
        <p className='text-sm font-medium text-muted-foreground mb-2'>
          {formatDate()}
        </p>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-3'>
          {getGreeting()}, <span className='text-primary'>{userName}</span>님
        </h1>
        <p className='text-muted-foreground text-lg'>
          오늘 할 일을 시작해보세요.
        </p>
      </div>
    </section>
  );
}
