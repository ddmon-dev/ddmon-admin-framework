import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../_base/types';

export const CONFIG = {
  title: '',
  moduleName: 'FAQ',
  tableName: 'faqs',
  enableBulkAction: true,
  categoryOptions: [
    { label: '일반', value: 'general' },
    { label: '서비스', value: 'service' },
    { label: '결제', value: 'payment' },
  ],
  enableReorder: true,
} as const;

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
