import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/shared/ui/empty';

export default function NotFound() {
  return (
    <Empty className='min-h-screen border-0'>
      <EmptyHeader>
        <EmptyMedia className='mb-4'>
          <span className='text-8xl font-secondary font-medium tracking-tighter text-muted-foreground/50'>
            404
          </span>
        </EmptyMedia>
        <EmptyTitle className='text-2xl'>페이지를 찾을 수 없습니다</EmptyTitle>
        <EmptyDescription>
          요청하신 페이지가 존재하지 않거나
          <br />
          이동되었을 수 있습니다.
        </EmptyDescription>
      </EmptyHeader>

      <Button
        asChild
        size='lg'
        variant='black'
      >
        <Link href='/'>홈으로 돌아가기</Link>
      </Button>
    </Empty>
  );
}
