import { type DbRow as BaseDbRow } from '@/shared/lib/supabase/helpers';
import { type TableType } from './config';

/**
 * DB 테이블 Row 타입 (snake_case)
 *
 * Phase 1: Database['Tables']['Notices']['Row']
 * Phase 2: Supabase CLI 자동 생성 후에도 동일하게 작동
 */
export type DbRow = BaseDbRow<TableType>;

/**
 * 프론트엔드 데이터 모델 (camelCase)
 * DB 조회 후 transformSnakeToCamel 결과 타입
 */
export interface ListRow {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  viewCount: number;
  category: string;
}
