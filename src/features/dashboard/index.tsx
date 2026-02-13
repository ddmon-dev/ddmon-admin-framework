import { Container } from '@/shared/ui/container';
import { AppHeader } from '@/shared/ui/app-header';
import { HeroSection } from './hero-section';
import { QuickActions } from './quick-actions';

export function Dashboard() {
  return (
    <>
      <AppHeader />
      <Container className="flex flex-col gap-8 flex-1 justify-between pb-8 xl:pb-14 md:px-8 lg:px-14 xl:px-20 mt-4 xl:mt-8">
        <HeroSection />
        <QuickActions />
      </Container>
    </>
  );
}
