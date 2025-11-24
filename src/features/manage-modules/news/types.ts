import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { CONFIG } from './config';
import { ItemDTO as BaseItemDTO } from '../_base/types';

/**
 * DB 테이블 Row 타입 (snake_case)
 */
export type RowData = BaseRowData<typeof CONFIG.tableName>;

/**
 * 프론트엔드 데이터 모델 (camelCase)
 * WithFiles 포함 (파일 업로드 지원)
 */
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
