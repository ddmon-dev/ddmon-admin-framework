import { ActionResult } from '@/shared/types/server-actions';

export interface ListProps<T> {
  list: T[];
  totalCount: number;
}

export type GetListResult<T> = ActionResult<ListProps<T>>;
export type GetItemResult<T> = ActionResult<T>;
export type UpdateResult<T> = ActionResult<T>;
export type CreateResult<T> = ActionResult<T>;
export type DeleteResult<T> = ActionResult<T>;

export type { FileUploadResult, FileDeleteResult } from '@/shared/lib/supabase/storage';
