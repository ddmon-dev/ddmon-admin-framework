'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn } from '@/features/auth';
import { DemoOverlay, DemoOverlayMessage } from '@/shared/ui/demo-overlay';
import { LoadingButton } from '@/shared/ui/loading-button';
import { AUTH_ERRORS } from '@/shared/constants/error-messages';

/**
 * 데모 모드 로그인 오버레이.
 *
 * 공용 DemoOverlay(backdrop-blur shell) 위에 원클릭 '데모로 접속' 버튼을 얹어
 * 데모 계정 실제 로그인을 수행한다. 폼을 지우지 않고 블러로 남겨 실제 인증 폼 존재를 보인다.
 */
export function DemoLoginOverlay() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDemoLogin() {
    setIsLoading(true);

    try {
      // 자격증명은 서버(authorize)가 주입한다. 클라이언트는 데모 접속 의사만 전달.
      const result = await signIn('credentials', {
        demo: 'true',
        redirect: false,
      });

      if (result?.error) {
        toast.error(AUTH_ERRORS.CREDENTIALS_SIGNIN);
        setIsLoading(false);
        return;
      }

      router.push('/');
    } catch (error) {
      console.error('데모 로그인 에러:', error);
      toast.error(AUTH_ERRORS.UNKNOWN_ERROR);
      setIsLoading(false);
    }
  }

  return (
    <DemoOverlay className="-inset-8">
      <DemoOverlayMessage>데모 계정으로 자유롭게 둘러보세요</DemoOverlayMessage>
      <LoadingButton
        type="button"
        isLoading={isLoading}
        onClick={handleDemoLogin}
        className="min-w-40"
      >
        데모로 접속
      </LoadingButton>
    </DemoOverlay>
  );
}
