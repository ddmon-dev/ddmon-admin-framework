import type { Metadata } from 'next';
import { cn } from '@/shared/utils/classnames';
import { primary, secondary } from '@/fonts';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { DialogProvider } from '@/shared/ui/app-dialog';
import { auth } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
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
      className={cn(primary.variable, secondary.variable)}
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
                position='bottom-center'
              />
            </DialogProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
