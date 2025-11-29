'use client';

import { useAppHeader } from '@/shared/ui/app-header';
import { Dashboard } from '@/widgets/dashboard';

export default function DashboardPage() {
  useAppHeader({ title: '대시보드' });

  return <Dashboard />;
}
