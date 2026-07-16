import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { StatusLayout, type StatusSize } from './status-layout';

interface ForbiddenStatusProps {
  fullScreen?: boolean;
  size?: StatusSize;
}

export function ForbiddenStatus({ fullScreen, size = 'lg' }: ForbiddenStatusProps) {
  return (
    <StatusLayout
      code="403"
      title="접근 권한이 없습니다"
      description={<>이 페이지에 접근할 수 있는 권한이 없습니다.</>}
      actions={
        <div className="flex gap-2">
          <Button asChild size="lg" variant="default">
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      }
      fullScreen={fullScreen}
      size={size}
    />
  );
}
