import { type ActionResult } from '@/shared/types/server-actions';

export interface ListProps<T> {
  list: T[];
  totalCount: number;
}

export type FetchListResult<T> = ActionResult<ListProps<T>>;
