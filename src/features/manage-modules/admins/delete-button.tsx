'use client';

import { APP_CONFIG } from '@/app.config';
import { usePathname } from 'next/navigation';
import { useDialog } from '@/shared/ui/app-dialog';
import { SoftDeleteButton } from '../_base/ui';
import { CONFIG } from './config';
import { deleteAdmin } from './actions';

export function DeleteAdminButton({ id, disabled }: { id: string; disabled: boolean }) {
  const pathname = usePathname();
  const dialog = useDialog();

  return (
    <SoftDeleteButton
      id={id}
      tableName={CONFIG.tableName}
      deleteFn={() => deleteAdmin({ id, pathname })}
      dataLabel={`아이디: ${id}`}
      disabled={disabled}
      onDisabled={() => {
        dialog.alert({
          description: `${APP_CONFIG.AUTH.ADMIN_LABELS.SUPER_ADMIN}는 삭제할 수 없습니다.`,
          variant: 'error',
          layout: 'vertical',
          size: 'sm',
        });
      }}
    />
  );
}
