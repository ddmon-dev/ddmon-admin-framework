import { Badge } from '@/shared/ui/badge';
import { STATUS_CONFIG } from './config';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant={config?.variant ?? 'secondary'}>
      {config?.label ?? status}
    </Badge>
  );
}
