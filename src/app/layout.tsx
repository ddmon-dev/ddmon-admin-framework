import type { Metadata } from 'next';
import { cn } from '@/shared/utils/classnames';
import { fontPrimary, fontSecondary } from '@/fonts';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { DialogProvider } from '@/shared/providers';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      className={cn(fontPrimary.variable, fontSecondary.variable)}
      suppressHydrationWarning
    >
      <body className={cn('antialiased')}>
        <ThemeProvider
          attribute='class'
          enableSystem={true}
        >
          <SessionProvider>
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
