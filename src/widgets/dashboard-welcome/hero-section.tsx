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

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '오늘도 좋은 하루 되세요.';
  if (hour < 18) return '오늘 오후도 힘내세요.';
  return '오늘 하루도 수고하셨어요.';
}

export function HeroSection() {
  const { data: session } = useSession();
  const userName = session?.user?.name || '관리자';

  return (
    <section className='py-4 md:py-6'>
      <h1 className='-ml-1.5 text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-[1.1]'>
        안녕하세요,
        <br />
        <span className='bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent'>
          {userName}
        </span>
        <span className='font-light'>님.</span>
      </h1>
      <p className='text-2xl md:text-3xl font-light text-foreground mt-8 tracking-wide'>
        {getTimeGreeting()}
      </p>
    </section>
  );
}
