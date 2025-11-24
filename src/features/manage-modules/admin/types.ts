import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { CamelCaseKeys } from '@/shared/lib/utils/objects';
import { WithFiles } from '@/shared/lib/file-system';
import { CONFIG } from './config';

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = WithFiles<CamelCaseKeys<RowData>>;
