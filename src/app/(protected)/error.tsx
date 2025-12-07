'use client';

import { useEffect } from 'react';
import { ErrorStatus } from '@/shared/ui/status-pages';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorStatus onRetry={reset} />;
}
