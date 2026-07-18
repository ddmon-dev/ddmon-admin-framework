import { z } from 'zod';
import { type DateRange } from 'react-day-picker';
import { createFilesSchema, dbFilesSchema } from '@/shared/lib/file-system';
import type { PresetSchema } from './types';

/**
 * 이메일 검증
 * - Zod의 email() 메서드 사용
 * - FormEmailInput과 함께 사용
 *
 * @example
 * // 필수 필드
 * email: schemaPresets.email()
 *
 * @example
 * // 선택 필드
 * email: schemaPresets.email({ optional: true })
 *
 * @example
 * // 커스텀 메시지
 * email: schemaPresets.email({ message: '회사 이메일을 입력하세요' })
 */
export const email = <T extends { message?: string; optional?: boolean } | undefined = undefined>(
  options?: T
): PresetSchema<T> => {
  const schema = z.string().email(options?.message || '올바른 이메일을 입력해주세요.');
  return (options?.optional ? schema.nullish().or(z.literal('')) : schema) as PresetSchema<T>;
};

/**
 * 전화번호 검증
 * - 한국 전화번호 형식 (02/010/070 등)
 * - 하이픈 없이 10~11자리 숫자
 * - FormPhoneInput과 함께 사용 (자동 하이픈 삽입)
 *
 * @example
 * // 필수 필드
 * phone: schemaPresets.phone()
 *
 * @example
 * // 선택 필드
 * phone: schemaPresets.phone({ optional: true })
 *
 * @example
 * // 커스텀 패턴 (국제 전화번호)
 * phone: schemaPresets.phone({
 *   pattern: /^\+?[1-9]\d{1,14}$/,
 *   message: '국제 전화번호 형식으로 입력하세요'
 * })
 */
export const phone = <
  T extends { message?: string; optional?: boolean; pattern?: RegExp } | undefined = undefined,
>(
  options?: T
): PresetSchema<T> => {
  // 02: 9~10자리, 010/070: 11자리, 기타(0XX): 10자리
  const pattern = options?.pattern || /^(02[0-9]{7,8}|0[17]0[0-9]{8}|0[0-9]{9})$/;
  const message = options?.message || '올바른 전화번호를 입력해주세요.';
  const schema = z.string().regex(pattern, message);
  return (options?.optional ? schema.nullish().or(z.literal('')) : schema) as PresetSchema<T>;
};

/**
 * URL 검증
 * - Zod의 url() 메서드 사용
 * - http, https 프로토콜 검증
 * - FormUrlInput과 함께 사용
 *
 * @example
 * // 필수 필드
 * website: schemaPresets.url()
 *
 * @example
 * // 선택 필드
 * website: schemaPresets.url({ optional: true })
 *
 * @example
 * // 커스텀 메시지
 * website: schemaPresets.url({ message: 'https://로 시작하는 URL을 입력하세요' })
 */
export const url = <T extends { message?: string; optional?: boolean } | undefined = undefined>(
  options?: T
): PresetSchema<T> => {
  const schema = z.string().url(options?.message || '올바른 URL을 입력해주세요.');
  return (options?.optional ? schema.nullish().or(z.literal('')) : schema) as PresetSchema<T>;
};

/**
 * 파일 업로드 검증
 *
 * @example
 * // 간단 사용 (모두 선택 필드)
 * files: schemaPresets.files(['thumbnail', 'attachments'])
 *
 * @example
 * // 고급 사용 (카테고리별 최소 개수 지정)
 * files: schemaPresets.files({
 *   thumbnail: 1,        // 필수, 최소 1개
 *   attachments: 0,      // 선택
 * })
 */
export const files = createFilesSchema;

/**
 * DB에 저장된 파일 메타데이터 검증 (서버 액션용)
 *
 * @example
 * // writeSchema에 포함 — update 검증에서 files 필드 보존
 * files: schemaPresets.dbFiles().optional()
 */
export const dbFiles = () => dbFilesSchema;

/**
 * 날짜 범위 검증
 *
 * @example
 * // 필수 (from 날짜 필수)
 * period: schemaPresets.dateRange()
 *
 * @example
 * // 선택 (from, to 모두 선택)
 * searchPeriod: schemaPresets.dateRange({ optional: true })
 */
export const dateRange = (options?: { optional?: boolean }) => {
  const baseSchema = z.object({
    from: z.date().nullish(),
    to: z.date().nullish(),
  });

  if (options?.optional) {
    return baseSchema;
  }

  return baseSchema.refine((data): data is DateRange => !!data.from, {
    message: '기간을 선택해주세요',
  });
};

/**
 * 숫자 범위 검증
 * - 기본: 0 이상 999999999 이하 (int4 컬럼 고려)
 * - min, max 커스터마이징 가능
 * - 조회수, 점수, 평점, 수량 등 다양한 숫자 필드에 사용
 *
 * @example
 * // 조회수 (기본, 0~999999999)
 * viewCount: schemaPresets.numberRange()
 *
 * @example
 * // 선택 필드
 * viewCount: schemaPresets.numberRange({ optional: true })
 *
 * @example
 * // 범위 커스터마이징
 * score: schemaPresets.numberRange({ min: 0, max: 100 })
 * rating: schemaPresets.numberRange({ min: 1, max: 5 })
 * quantity: schemaPresets.numberRange({ min: 1, max: 9999 })
 */
export const numberRange = (options?: {
  min?: number;
  max?: number;
  optional?: boolean;
  message?: string;
}) => {
  const minValue = options?.min ?? 0;
  const maxValue = options?.max ?? 999999999;
  const message = options?.message || '숫자를 입력해주세요.';

  const schema = z
    .number({ message })
    .min(minValue, { message: `${minValue} 이상이어야 합니다.` })
    .max(maxValue, { message: `${minValue} 이상 ${maxValue} 이하여야 합니다.` });

  return options?.optional ? schema.nullish() : schema;
};

/**
 * 배열 필드 검증
 * - 배열 요소의 스키마를 받아서 배열 필드를 검증
 *
 * @param itemSchema - 배열 요소의 스키마
 * @param options - 선택 여부 options = { optional: true } → 선택 필드
 * @returns 배열 필드 스키마
 */
export const fieldArray = (itemSchema: z.ZodSchema, options?: { optional?: boolean }) => {
  let schema = z.array(z.object({ value: itemSchema }));

  if (options?.optional) {
    schema = schema.refine(
      (data) => data.some((item) => item.value !== null && item.value !== undefined),
      {
        message: '최소 1개 이상 입력해주세요.',
        path: ['root'],
      }
    );
  }

  return schema;
};
