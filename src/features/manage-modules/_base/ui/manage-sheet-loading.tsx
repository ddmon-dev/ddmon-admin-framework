'use client';

import { Skeleton } from '@/shared/ui/skeleton';

export function ManageSheetLoading() {
  return (
    <div className='space-y-6 py-4'>
      {/* Form fields skeleton */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-10 w-full' />
        </div>
      ))}

      {/* Buttons skeleton */}
      <div className='flex justify-end gap-2 pt-4'>
        <Skeleton className='h-10 w-20' />
        <Skeleton className='h-10 w-20' />
      </div>
    </div>
  );
}
