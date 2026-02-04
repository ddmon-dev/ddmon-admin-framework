import { cn } from '@/shared/utils/classnames';

/**
 * 데이터 필드 컴포넌트
 * 테이블 형식으로 라벨-값 쌍을 표시합니다.
 */
interface DetailFieldProps {
  label: string;
  value?: React.ReactNode;
  emptyText?: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function DetailField({
  label,
  value,
  emptyText = '-',
  className,
  labelClassName,
  valueClassName,
}: DetailFieldProps) {
  const displayValue = value || emptyText;

  return (
    <div className={cn('grid grid-cols-[6rem_1fr]', className)}>
      <span
        className={cn(
          'text-sm font-medium bg-muted/50 px-4 py-2.5 flex',
          labelClassName
        )}
      >
        {label}
      </span>
      <span className={cn('text-sm px-4 py-2.5', valueClassName)}>
        {displayValue}
      </span>
    </div>
  );
}

/**
 * 데이터 그룹 컴포넌트
 * 섹션 제목과 필드들을 테이블 형태로 그룹화합니다.
 */
interface DetailGroupProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DetailGroup({ title, children, className }: DetailGroupProps) {
  return (
    <section className={cn('space-y-3', className)}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="divide-y border rounded-lg overflow-hidden">
        {children}
      </div>
    </section>
  );
}

/**
 * 데이터 행 컴포넌트
 * 가로 2컬럼 배치용입니다.
 */
interface DetailRowProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailRow({ children, className }: DetailRowProps) {
  return <div className={cn('grid grid-cols-2', className)}>{children}</div>;
}

interface DetailContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailContainer({ children, className }: DetailContainerProps) {
  return (
    <div className={cn('space-y-8 pb-6 md:pb-8', className)}>{children}</div>
  );
}
