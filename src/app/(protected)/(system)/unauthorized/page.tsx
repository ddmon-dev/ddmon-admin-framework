import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle>접근 권한이 없습니다</CardTitle>
          <CardDescription>
            이 페이지에 접근할 수 있는 권한이 없습니다.
            필요한 권한이 있다고 생각하시면 관리자에게 문의해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/">대시보드로 돌아가기</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">다시 로그인</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}