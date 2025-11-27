import { WithFiles } from '@/shared/lib/file-system';
import { CamelCaseKeys } from '@/shared/utils/objects';
import { RowData, TableName } from '@/shared/lib/supabase/db-helpers';

// 관리 모듈 기본 설정
export const BASE_CONFIG = {
  defaultListPageSize: 2, // 페이지당 데이터 목록 행 수
  defaultListPaginationMaxVisible: 7, // 페이지네이션 최대 표시 페이지 수
} as const;

// 관리 모듈 공통 타입
export interface ListProps<T> {
  data: T[];
  totalCount: number;
}

export type ItemDTO<T extends TableName> = WithFiles<CamelCaseKeys<RowData<T>>>;

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
