import type { ZodType } from 'zod';
import { WithFiles } from '@/shared/lib/file-system';
import { RowData, TableName } from '@/shared/lib/supabase/db-helpers';

// 관리 모듈 공통 타입
export interface ListProps<T> {
  data: T[];
  totalCount: number;
}

export type ManageSheetMode = 'view' | 'modify' | 'create' | 'clone';

export type ItemDTO<T extends TableName> = WithFiles<RowData<T>>;

export interface GetListParams {
  page?: string;
  search?: string;
  category?: string;
  pageSize?: number;
}

export interface GetItemParams {
  id: string;
}

export interface CreateItemParams<T> {
  values: Partial<T>;
  pathname?: string;
}

export interface UpdateItemParams<T> {
  id: string;
  values: Partial<T>;
  pathname?: string;
}

export interface DeleteItemParams {
  tableName: TableName;
  id: string;
  pathname?: string;
}

export interface GetExportDataParams {
  tableName: TableName;
}

/**
 * 순서 재정렬 기능 설정
 *
 * @example
 * // 기본 사용 (asc 정렬)
 * enableReorder: true
 *
 * // 정렬 방향 변경 (드묾)
 * enableReorder: { direction: 'desc' }
 */
export type ReorderConfig = true | { direction?: 'asc' | 'desc' };

/**
 * 모듈 기본 설정 (actions에서 사용)
 * 각 모듈의 config.ts에서 이 속성들을 포함하면 actions에서 자동 적용
 */
export interface ModuleBaseConfig {
  tableName: TableName;
  searchFields?: string[];
  enableReorder?: ReorderConfig;
  schema?: ZodType;
}
