import { requireAuth } from '@/features/auth';

export default async function SuperAdminOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 슈퍼 관리자 인증 확인
  await requireAuth({ requireSuper: true });

  return <>{children}</>;
}
