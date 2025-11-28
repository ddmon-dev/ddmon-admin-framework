import { Skeleton } from '@/shared/ui/skeleton';

interface ListSkeletonProps {
  rows?: number;
  columns?: number;
}

export function ListSkeleton({ rows = 10, columns = 5 }: ListSkeletonProps) {
  return (
    <>
      {/* Total count skeleton */}
      <div className='flex items-center justify-between mb-2'>
        <Skeleton className='h-5 w-20' />
      </div>

      {/* Table skeleton */}
      <div className='overflow-hidden rounded-md border'>
        <div className='bg-background-secondary'>
          {/* Header */}
          <div className='flex border-b p-3'>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className='flex-1 px-2'>
                <Skeleton className='h-4 w-full max-w-20 mx-auto' />
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className='flex border-b last:border-b-0 p-3'>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className='flex-1 px-2'>
                <Skeleton className='h-4 w-full max-w-24 mx-auto' />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className='sticky bottom-0 bg-background flex items-center justify-center border-t p-4 -mx-4 rounded-b-lg md:justify-between'>
        <div className='flex items-center gap-1'>
          <Skeleton className='size-9 rounded-md' />
          <Skeleton className='size-9 rounded-md' />
          <Skeleton className='size-9 rounded-md' />
          <Skeleton className='size-9 rounded-md' />
          <Skeleton className='size-9 rounded-md' />
        </div>
        <Skeleton className='h-9 w-20 hidden md:block' />
      </div>
    </>
  );
}
