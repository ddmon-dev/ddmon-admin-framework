import { APP_CONFIG } from '@/app.config';
import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../_base/types';

export const CONFIG = {
  title: '',
  moduleName: '관리자 계정',
  tableName: APP_CONFIG.AUTH.ADMIN_TABLE_NAME,
  enableBulkAction: false,
} as const;

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
