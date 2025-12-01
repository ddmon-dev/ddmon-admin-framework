'use client';

import { usePathname } from 'next/navigation';
import { SoftDeleteButton } from '../_base/ui';
import { CONFIG } from './config';
import { deleteAdmin } from './actions';

export function DeleteAdminButton({ id, disabled }: { id: string; disabled: boolean }) {
  const pathname = usePathname();

  return (
    <SoftDeleteButton
      id={id}
      tableName={CONFIG.tableName}
      deleteFn={() => deleteAdmin({ id, pathname })}
      dataLabel='관리자 계정'
      disabled={disabled}
    />
  );
}
