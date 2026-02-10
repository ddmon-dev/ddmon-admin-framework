import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../_base/types';
import { writeSchema } from './schema';

export const CONFIG = {
  title: '',
  moduleName: '팝업',
  tableName: 'popups',
  searchFields: ['title'],
  enableBulkAction: true,
  schema: writeSchema,
} as const;

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
