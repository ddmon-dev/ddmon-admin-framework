import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { StatusLayout } from './status-layout';

interface UnauthorizedStatusProps {
  fullScreen?: boolean;
}

export function UnauthorizedStatus({ fullScreen }: UnauthorizedStatusProps) {
  return (
    <StatusLayout
      code='403'
      title='접근 권한이 없습니다'
      description={
        <>
          이 페이지에 접근할 수 있는 권한이 없습니다.
          <br />
          필요한 권한이 있다고 생각하시면 최고 관리자에게 문의해주세요.
        </>
      }
      actions={
        <div className='flex gap-2'>
          <Button
            asChild
            size='lg'
            variant='default'
          >
            <Link href='/'>홈으로</Link>
          </Button>
        </div>
      }
      fullScreen={fullScreen}
    />
  );
}
