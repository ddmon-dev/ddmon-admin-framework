import { RowData as BaseRowData, DbUpdate, DbInsert } from '@/shared/lib/supabase/db-helpers';
import { CamelCaseKeys } from '@/shared/lib/utils/objects';
import { WithFiles } from '@/shared/lib/file-system';
import { CONFIG } from './config';

/**
 * DB 테이블 Row 타입 (snake_case)
 * Supabase CLI에서 받은 타입을 그대로 사용하기 위해 정의
 */
export type RowData = BaseRowData<typeof CONFIG.tableName>;

/**
 * 프론트엔드 데이터 모델 (camelCase)
 * snake_case인 DB의 데이터를 프론트엔드에서 사용하기 위해 camelCase로 변환
 * WithFiles 헬퍼를 사용하여 파일 업로드 지원
 */
export type ItemDTO = WithFiles<CamelCaseKeys<RowData>>;

/**
 * 업데이트 항목 값 타입
 * Presigned URL 방식에서는 files를 Server Action에서 받지 않음
 */
export type UpdateItemValues = WithFiles<DbUpdate<typeof CONFIG.tableName>>;

/**
 * 생성 항목 값 타입
 * Presigned URL 방식에서는 files를 Server Action에서 받지 않음
 */
export type CreateItemValues = WithFiles<DbInsert<typeof CONFIG.tableName>>;
