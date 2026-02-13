'use client';

import { APP_CONFIG } from '@/app.config';
import { usePathname } from 'next/navigation';
import { useDialog } from '@/shared/ui/app-dialog';
import { RowActions, confirmDelete } from '../_base/ui';
import { CONFIG } from './config';
import { deleteAdmin } from './actions';

interface AdminRowActionsProps {
  id: string;
  isSuperAdmin: boolean;
}

export function AdminRowActions({ id, isSuperAdmin }: AdminRowActionsProps) {
  const dialog = useDialog();
  const pathname = usePathname();

  return (
    <RowActions
      type="buttons"
      id={id}
      tableName={CONFIG.tableName}
      actions={[
        { action: 'modify', label: '정보수정' },
        {
          action: 'delete',
          onClick: isSuperAdmin
            ? () => {
                dialog.alert({
                  description: `${APP_CONFIG.AUTH.ADMIN_LABELS.SUPER_ADMIN}는 삭제할 수 없습니다.`,
                  variant: 'error',
                  layout: 'vertical',
                  size: 'sm',
                });
              }
            : () =>
                confirmDelete(dialog, {
                  deleteFn: () => deleteAdmin({ id, pathname }),
                }),
        },
      ]}
    />
  );
}
