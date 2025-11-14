'use client';

import { cn } from '@/shared/utils/classnames';
import { Button } from '@/shared/ui/button';

interface OAuthButtonsProps {
  isLoading?: boolean;
  mode?: 'login' | 'signup';
}

export function OAuthButtons({ isLoading = false, mode = 'login' }: OAuthButtonsProps) {
  const actionText = mode === 'login' ? '계속하기' : '시작하기';

  async function handleOAuthLogin(provider: 'google' | 'kakao') {
    if (isLoading) return;
    console.log(`OAuth login with ${provider}`);
  }

  return (
    <div className={cn('space-y-3')}>
      <Button
        type='button'
        variant='outline'
        size='lg'
        className={cn(
          'w-full relative hover:border-[#4285f4] hover:text-[#4285f4] transition-colors'
        )}
        onClick={() => handleOAuthLogin('google')}
        disabled={isLoading}
      >
        <svg
          className={cn('absolute left-3 h-5 w-5')}
          aria-hidden='true'
          focusable='false'
          data-prefix='fab'
          data-icon='google'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 488 512'
        >
          <path
            fill='#4285f4'
            d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
          ></path>
        </svg>
        <span>Google로 {actionText}</span>
      </Button>

      <Button
        type='button'
        variant='outline'
        size='lg'
        className={cn(
          'w-full relative hover:border-[#3A1D1D] hover:text-[#3A1D1D] transition-colors'
        )}
        onClick={() => handleOAuthLogin('kakao')}
        disabled={isLoading}
      >
        <svg
          className={cn('absolute left-3 h-5 w-5')}
          aria-hidden='true'
          focusable='false'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
        >
          <path
            fill='#3A1D1D'
            d='M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-1.363l.427-.413 1.428 2.033a.472.472 0 1 0 .773-.543l-1.514-2.155zm-2.958 1.924h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 1 0 0-.944zm-5.857-1.092l.696-1.707.638 1.707H9.092zm2.523.488l.002-.016a.469.469 0 0 0-.127-.32l-1.046-2.8a.69.69 0 0 0-.627-.474.696.696 0 0 0-.653.447l-1.661 4.075a.472.472 0 0 0 .874.357l.33-.813h2.07l.299.8a.472.472 0 1 0 .884-.33l-.345-.926zM8.293 9.302a.472.472 0 0 0-.471-.472H4.577a.472.472 0 1 0 0 .944h1.16v3.736a.472.472 0 0 0 .944 0V9.774h1.14c.261 0 .472-.212.472-.472z'
          />
        </svg>
        <span>카카오로 {actionText}</span>
      </Button>
    </div>
  );
}
