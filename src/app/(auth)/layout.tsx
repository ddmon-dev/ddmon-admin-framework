import { redirect } from 'next/navigation';
import { auth } from '@/features/auth/server';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return children;
}
