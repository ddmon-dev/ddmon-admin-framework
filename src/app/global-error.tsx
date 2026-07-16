'use client';

import { useEffect } from 'react';
import { ErrorStatus } from '@/shared/ui/status-pages';
import './globals.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="antialiased">
        <ErrorStatus onRetry={reset} fullScreen />
      </body>
    </html>
  );
}
