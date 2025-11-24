import { auth } from '@/features/auth';
import { redirect } from 'next/navigation';

export default async function SuperAdminOnlyLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user.superAdmin) {
    redirect('/');
  }

  return <>{children}</>;
}
