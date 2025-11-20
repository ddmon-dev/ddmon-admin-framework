import { type ActionResult } from '@/shared/types/server-actions';

export interface ListProps<T> {
  list: T[];
  totalCount: number;
}

export type FetchListResult<T> = ActionResult<ListProps<T>>;

export type FetchItemResult<T> = ActionResult<T>;

export type UpdateResult<T> = ActionResult<T>;

export type CreateResult<T> = ActionResult<T>;

export type DeleteResult<T> = ActionResult<T>;
