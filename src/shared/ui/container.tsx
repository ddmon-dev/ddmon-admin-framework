import { cn } from '../utils/classnames';

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('py-4 px-4 md:px-8 lg:px-3 w-full mx-auto', className)}>{children}</div>
  );
}
