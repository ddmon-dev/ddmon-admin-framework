import type { BaseRowData, CamelCaseKeys, DbInsert, DbUpdate } from '@/shared/lib/supabase/types';
import type { DbFileMetadata } from '@/shared/lib/supabase/file-helpers';

export type RowData = BaseRowData<'demo_items'>;
export type ItemDTO = CamelCaseKeys<RowData>;

export type ItemFiles = {
  attachments?: DbFileMetadata[];
  avatar?: DbFileMetadata[];
};

export type ItemDTOWithFiles = ItemDTO & {
  files?: ItemFiles;
};

export type CreateItemValues = DbInsert<'demo_items'>;
export type UpdateItemValues = DbUpdate<'demo_items'>;

// Server Action 공통 파라미터
export interface Params {
  id: string;
  path?: string;
}

// Action Result 타입
export type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Delete Result 타입
export type DeleteResult<T> = ActionResult<T>;
