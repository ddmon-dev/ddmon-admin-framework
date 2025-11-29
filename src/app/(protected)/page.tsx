'use client';

import { useAppHeader } from '@/shared/ui/app-header';
import { Container } from '@/shared/ui/container';
import { DashboardWelcome } from '@/widgets/dashboard-welcome';

export default function DashboardPage() {
  useAppHeader({ title: '대시보드' });

  return (
    <Container className='py-6'>
      <DashboardWelcome />
    </Container>
  );
}
