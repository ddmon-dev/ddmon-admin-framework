import { HeroSection } from './hero-section';
import { QuickActions } from './quick-actions';

export function DashboardWelcome() {
  return (
    <div className='flex flex-col gap-8'>
      <HeroSection />
      <QuickActions />
    </div>
  );
}
