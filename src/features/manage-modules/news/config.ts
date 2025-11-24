import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../_base/config';

export const CONFIG = {
  moduleName: '뉴스',
  tableName: 'news',
} as const;

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
