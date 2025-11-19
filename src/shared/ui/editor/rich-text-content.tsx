import { cn } from '@/shared/utils/classnames';
import './rich-text-content.css';

interface RichTextContentProps {
  children: string | null | undefined;
  className?: string;
}

export function RichTextContent({ children, className }: RichTextContentProps) {
  if (!children) return null;

  return (
    <div
      className={cn('rich-text-content', className)}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}
