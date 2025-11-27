import { cn } from '../utils/classnames';
import { cva, type VariantProps } from 'class-variance-authority';

const containerVariants = cva('mx-auto px-4 md:px-6 lg:px-8 w-full', {
  variants: {
    size: {
      default: 'max-w-7xl',
      sm: 'max-w-3xl',
      md: 'max-w-4xl',
      lg: 'max-w-5xl',
      xl: 'max-w-6xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export function Container({
  children,
  className,
  size,
}: VariantProps<typeof containerVariants> & {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(containerVariants({ size, className }))}>{children}</div>;
}

export function ContentContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('py-4 px-4 md:px-8 lg:px-10 md:py-8 lg:py-10 w-full mx-auto', className)}>
      {children}
    </div>
  );
}
