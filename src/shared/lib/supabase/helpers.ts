/**
 * Supabase Database Type Helpers
 *
 * DB 타입 관련 헬퍼 함수 및 유틸리티 타입
 */

import { Database } from './types';
import { transformSnakeToCamel, type CamelCaseKeys } from '../utils/objects';

/**
 * 테이블 이름 타입
 */
export type TableName = keyof Database['Tables'];

/**
 * 테이블의 Row 타입 추출
 * @example
 * DbRow<'Notices'> → Database['Tables']['Notices']['Row']
 */
export type DbRow<T extends TableName> = Database['Tables'][T]['Row'];

/**
 * 테이블의 Insert 타입 추출
 * @example
 * DbInsert<'Notices'> → Database['Tables']['Notices']['Insert']
 */
export type DbInsert<T extends TableName> = Database['Tables'][T]['Insert'];

/**
 * 테이블의 Update 타입 추출
 * @example
 * DbUpdate<'Notices'> → Database['Tables']['Notices']['Update']
 */
export type DbUpdate<T extends TableName> = Database['Tables'][T]['Update'];

/**
 * DB Row 배열을 camelCase 배열로 변환
 * @example
 * transformDbRows<NoticeDbRow>(rawData)
 */
export function transformDbRows<TDbRow extends Record<string, any>>(
  rows: TDbRow[] | null
): CamelCaseKeys<TDbRow>[] {
  return (rows || []).map(row => transformSnakeToCamel(row));
}
