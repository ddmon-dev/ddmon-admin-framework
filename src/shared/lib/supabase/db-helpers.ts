/**
 * Supabase Database Type Helpers
 *
 * DB 타입 관련 헬퍼 함수 및 유틸리티 타입
 */

import { Database } from './types';

/**
 * 테이블 이름 타입
 */
export type TableName = keyof Database['public']['Tables'];

/**
 * 테이블의 Row 타입 추출
 * @example
 * RowData<'Notices'> → Database['public']['Tables']['Notices']['Row']
 */
export type RowData<T extends TableName> = Database['public']['Tables'][T]['Row'];

/**
 * 테이블의 Insert 타입 추출
 * @example
 * DbInsert<'Notices'> → Database['public']['Tables']['Notices']['Insert']
 */
export type DbInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];

/**
 * 테이블의 Update 타입 추출
 * @example
 * DbUpdate<'Notices'> → Database['public']['Tables']['Notices']['Update']
 */
export type DbUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];
