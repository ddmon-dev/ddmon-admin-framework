import { AppHeader } from '@/shared/ui/app-header';
import { Container } from '@/shared/ui/container';

export default function DashboardPage() {
  return (
    <>
      <AppHeader title='대시보드' />
      <Container className='py-6'>
        <p className='text-muted-foreground'>대시보드 콘텐츠가 여기에 표시됩니다.</p>
      </Container>
    </>
  );
}
