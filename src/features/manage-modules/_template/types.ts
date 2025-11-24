import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { CONFIG } from './config';
import { ItemDTO as BaseItemDTO } from '../_base/types';

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
