import {
  type RowData as BaseRowData,
  type DbUpdate,
  type DbInsert,
} from '@/shared/lib/supabase/db-helpers';
import { type CamelCaseKeys } from '@/shared/lib/utils/objects';
import { type FileMetadata } from '@/shared/lib/supabase/file-helpers';
import { CONFIG } from './config';

/**
 * DB 테이블 Row 타입 (snake_case)
 * Supabase CLI에서 받은 타입을 그대로 사용하기 위해 정의
 */
export type RowData = BaseRowData<typeof CONFIG.tableName>;

/**
 * 아이템 파일 구조
 * 모든 모듈에서 재사용 가능한 범용 타입
 */
export type ItemFiles = {
  thumbnail?: FileMetadata[];
  attachments?: FileMetadata[];
};

/**
 * 프론트엔드 데이터 모델 (camelCase)
 * snake_case인 DB의 데이터를 프론트엔드에서 사용하기 위해 camelCase로 변환
 */
export type ItemDTO = CamelCaseKeys<RowData> & {
  files?: ItemFiles;
};

/**
 * 업데이트 항목 값 타입
 * Presigned URL 방식에서는 files를 Server Action에서 받지 않음
 */
export type UpdateItemValues = DbUpdate<typeof CONFIG.tableName>;

/**
 * 생성 항목 값 타입
 * Presigned URL 방식에서는 files를 Server Action에서 받지 않음
 */
export type CreateItemValues = DbInsert<typeof CONFIG.tableName>;
