'use client';

import { useSession } from 'next-auth/react';

function getTimeGreeting(): React.ReactNode {
  const hour = new Date().getHours();
  if (hour < 12) return <>오늘도 좋은 아침입니다.</>;
  if (hour < 18) return <>오늘 오후도 화이팅입니다.</>;
  return <>오늘도 고생하셨습니다.</>;
}

export function HeroSection() {
  const { data: session } = useSession();
  const userName = session?.user?.name || '관리자';

  return (
    <section className='pt-4 px-4 md:px-0 mb-8 md:pt-6 md:mb-12'>
      <h1 className='text-3xl md:text-[42px] font-thin tracking-tighter leading-[1.2] text-secondary-foreground/70'>
        안녕하세요
        <br />
        <span className='bg-linear-to-r from-primary via-primary/60 to-primary bg-clip-text text-transparent font-normal animate-shimmer animation-duration-5000!'>
          {userName}
        </span>
        님
      </h1>
      <p className='text-2xl md:text-4xl font-thin text-secondary-foreground/70 mt-4 md:mt-6 tracking-tighter leading-[1.2]'>
        {getTimeGreeting()}
      </p>
    </section>
  );
}
