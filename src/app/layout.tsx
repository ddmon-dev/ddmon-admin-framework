import { APP_CONFIG } from '@/app.config';
import type { Metadata } from 'next';
import { cn } from '@/shared/utils/classnames';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { DialogProvider } from '@/shared/ui/app-dialog';
import { auth } from '@/features/auth';

/**
 * 폰트 설정
 *
 * 1. Primary 폰트: 프로젝트별로 선택 (아래 import 변경)
 *    - suit: 둥글고 친근한 느낌
 *    - nanumSquareNeo: 둥글둥글하고 부드러운 느낌
 *    - pretendard: 깔끔하고 현대적인 느낌
 *
 * 2. Secondary 폰트: Pretendard 고정 (font-secondary 클래스로 사용)
 *
 * 폰트 변경 방법:
 * - primaryFont import를 원하는 폰트로 변경
 * - 예: import { suit as primaryFont } from '@/fonts';
 *       import { nanumSquareNeo as primaryFont } from '@/fonts';
 */
import { suit as primaryFont, pretendard as secondaryFont } from '@/fonts';

export const metadata: Metadata = {
  title: APP_CONFIG.SEO.TITLE,
  description: APP_CONFIG.SEO.DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang='ko'
      className={cn(primaryFont.variable, secondaryFont.variable)}
      suppressHydrationWarning
    >
      <body className={cn('antialiased')}>
        <ThemeProvider
          attribute='class'
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <DialogProvider>
              {children}
              <Toaster
                richColors
                position='top-center'
              />
            </DialogProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
