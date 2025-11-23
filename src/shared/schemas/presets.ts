import { z } from 'zod';
import { type DateRange } from 'react-day-picker';
import { createFilesSchema } from '@/shared/lib/file-system';

/**
 * 복잡한 타입의 폼 필드를 위한 Zod 스키마 프리셋
 *
 * 검증 로직이 반복되거나 에러 메시지를 통일해야 하는 경우 사용합니다.
 *
 * @example
 * ```tsx
 * import { schemaPresets } from '@/shared/schemas/presets';
 *
 * const schema = z.object({
 *   name: z.string().min(1, '이름을 입력하세요'),  // 단순 검증
 *   email: schemaPresets.email({ allowEmpty: true }),  // 프리셋 사용
 *   phone: schemaPresets.phone({ allowEmpty: true }),
 *   website: schemaPresets.url({ allowEmpty: true }),
 *   files: schemaPresets.files({ thumbnail: 1, attachments: 0 }),
 * });
 * ```
 */
export const schemaPresets = {
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
   * // 선택 필드 (빈 문자열 허용)
   * email: schemaPresets.email({ allowEmpty: true })
   *
   * @example
   * // 커스텀 메시지
   * email: schemaPresets.email({ message: '회사 이메일을 입력하세요' })
   */
  email: (options?: { message?: string; allowEmpty?: boolean }) => {
    const schema = z.string().email(options?.message || '올바른 이메일을 입력해주세요.');
    return options?.allowEmpty ? schema.optional().or(z.literal('')) : schema;
  },

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
   * // 선택 필드 (빈 문자열 허용)
   * phone: schemaPresets.phone({ allowEmpty: true })
   *
   * @example
   * // 커스텀 패턴 (국제 전화번호)
   * phone: schemaPresets.phone({
   *   pattern: /^\+?[1-9]\d{1,14}$/,
   *   message: '국제 전화번호 형식으로 입력하세요'
   * })
   */
  phone: (options?: { message?: string; allowEmpty?: boolean; pattern?: RegExp }) => {
    const pattern = options?.pattern || /^0[0-9]{9,10}$/;
    const message = options?.message || '올바른 전화번호를 입력해주세요.';
    const schema = z.string().regex(pattern, message);
    return options?.allowEmpty ? schema.optional().or(z.literal('')) : schema;
  },

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
   * // 선택 필드 (빈 문자열 허용)
   * website: schemaPresets.url({ allowEmpty: true })
   *
   * @example
   * // 커스텀 메시지
   * website: schemaPresets.url({ message: 'https://로 시작하는 URL을 입력하세요' })
   */
  url: (options?: { message?: string; allowEmpty?: boolean }) => {
    const schema = z.string().url(options?.message || '올바른 URL을 입력해주세요.');
    return options?.allowEmpty ? schema.optional().or(z.literal('')) : schema;
  },
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
  files: createFilesSchema,

  /**
   * 날짜 범위 검증
   * - from 날짜 필수
   */
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine((data): data is DateRange => !!data.from, { message: '기간을 선택해주세요' }),

  /**
   * 조회수 검증
   * - 0 이상 999999999 이하 (int4 컬럼 고려)
   */
  viewCount: z
    .number()
    .min(0, { message: '조회수는 0 이상이어야 합니다.' })
    .max(999999999, { message: '조회수는 0 이상 999999999 이하여야 합니다.' }),
} as const;
