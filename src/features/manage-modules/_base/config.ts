import { ActionResult } from '@/shared/types/server-actions';
import { WithFiles } from '@/shared/lib/file-system';
import { CamelCaseKeys } from '@/shared/lib/utils/objects';
import { RowData, TableName } from '@/shared/lib/supabase/db-helpers';

export const BASE_CONFIG = {
  defaultListPageSize: 10,
} as const;

export interface ListProps<T> {
  data: T[];
  totalCount: number;
}
export type ItemDTO<T extends TableName> = WithFiles<CamelCaseKeys<RowData<T>>>;
export type GetListResult<T> = ActionResult<ListProps<T>>;
export type GetItemResult<T> = ActionResult<T>;
export type UpdateResult<T> = ActionResult<T>;
export type CreateResult<T> = ActionResult<T>;
export type DeleteResult<T> = ActionResult<T>;
