import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../_base/types';

export const CONFIG = {
  title: '',
  moduleName: 'FAQ',
  tableName: 'faqs',
  enableBulkAction: true,
} as const;

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
