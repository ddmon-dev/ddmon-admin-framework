import { RowData as BaseRowData, DbUpdate, DbInsert } from '@/shared/lib/supabase/db-helpers';
import { CamelCaseKeys } from '@/shared/lib/utils/objects';
import { WithFiles } from '@/shared/lib/file-system';
import { CONFIG } from './config';

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = WithFiles<CamelCaseKeys<RowData>>;

export type CreateItemValues = WithFiles<DbInsert<typeof CONFIG.tableName>>;
export type UpdateItemValues = WithFiles<DbUpdate<typeof CONFIG.tableName>>;

// Server Action 공통 파라미터
export interface Params {
  id: string;
  path?: string;
}
