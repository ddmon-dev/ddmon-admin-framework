import type { Metadata } from 'next';
import { cn } from '@/shared/lib/utils/classnames';
import { fontPrimary, fontSecondary } from '@/fonts';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';

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
          {children}
          <Toaster
            richColors
            position='bottom-center'
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
