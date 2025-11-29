'use client';

import { useAppHeader } from '@/shared/ui/app-header';
import { Container } from '@/shared/ui/container';

export default function DashboardPage() {
  useAppHeader({ title: '대시보드' });

  return (
    <Container className='py-6'>
      <p className='text-muted-foreground'>대시보드 콘텐츠가 여기에 표시됩니다.</p>
    </Container>
  );
}
