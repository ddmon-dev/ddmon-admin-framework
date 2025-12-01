import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../../_base/types';

export const CONFIG = {
  moduleName: '공지사항',
  tableName: 'notices',
  enableBulkAction: true,
  categoryOptions: [
    { label: '공지', value: 'notice' },
    { label: '일반', value: 'normal' },
  ],
} as const;

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
