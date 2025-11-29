'use client';

import { useSession } from 'next-auth/react';

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '오늘도 좋은 하루 되세요.';
  if (hour < 18) return '오늘 오후도 화이팅입니다.';
  return '오늘 하루 고생하셨습니다.';
}

export function HeroSection() {
  const { data: session } = useSession();
  const userName = session?.user?.name || '관리자';

  return (
    <section className='pt-4 px-4 md:px-0 mb-8 md:pt-6 md:mb-12'>
      <h1 className='text-4xl md:text-5xl font-thin tracking-tighter leading-[1.2] text-secondary-foreground/70'>
        안녕하세요,
        <br />
        <span className='bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent font-normal'>
          {userName}
        </span>
        님.
      </h1>
      <p className='text-2xl md:text-4xl font-thin text-secondary-foreground/70 mt-4 md:mt-6 tracking-tighter'>
        {getTimeGreeting()}
      </p>
    </section>
  );
}
