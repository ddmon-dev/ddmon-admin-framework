import { z } from 'zod';
import { type DateRange } from 'react-day-picker';
import { createFilesSchema } from '@/shared/lib/file-system';

/**
 * 복잡한 타입의 폼 필드를 위한 Zod 스키마 프리셋
 *
 * 단순한 검증(string, email 등)은 Zod를 직접 사용하세요.
 * 이 프리셋은 타입이 복잡하거나 검증 로직이 까다로운 경우에만 사용합니다.
 *
 * @example
 * ```tsx
 * import { schemaPresets } from '@/shared/schemas/presets';
 *
 * const schema = z.object({
 *   name: z.string().min(1, '이름을 입력하세요'),  // 직접 작성
 *   email: z.string().email('유효한 이메일'),       // 직접 작성
 *   files: schemaPresets.files(['thumbnail', 'attachments']),  // 프리셋 사용
 *   dateRange: schemaPresets.dateRange,            // 프리셋 사용
 * });
 * ```
 */
export const schemaPresets = {
  /**
   * 다중 카테고리 파일 업로드 검증
   * createFilesSchema를 re-export
   *
   * @example
   * // 간단 사용 (모두 선택)
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
} as const;
