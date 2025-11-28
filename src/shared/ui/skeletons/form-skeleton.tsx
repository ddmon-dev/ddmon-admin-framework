import { Skeleton } from '@/shared/ui/skeleton';

export function FormSkeleton() {
  return (
    <div className='space-y-6 py-4'>
      {/* 라디오 그룹 */}
      <div className='space-y-3'>
        <Skeleton className='h-4 w-16' />
        <div className='flex gap-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Skeleton className='size-4 rounded-full' />
              <Skeleton className='h-4 w-12' />
            </div>
          ))}
        </div>
      </div>

      {/* 날짜 선택기 */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-10 w-48' />
      </div>

      {/* 숫자 입력 */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-10 w-32' />
      </div>

      {/* 텍스트 입력 */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-10' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* 에디터 */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-10' />
        <Skeleton className='h-[200px] w-full rounded-lg' />
      </div>

      {/* 파일 업로드 (썸네일) */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-14' />
        <Skeleton className='h-32 w-full rounded-lg' />
      </div>

      {/* 파일 업로드 (첨부파일) */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-32 w-full rounded-lg' />
      </div>

      {/* Footer */}
      <div className='flex justify-end gap-2 pt-4 border-t'>
        <Skeleton className='h-10 w-16' />
        <Skeleton className='h-10 w-16' />
      </div>
    </div>
  );
}
