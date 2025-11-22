import { z } from 'zod';
import { type FormFileValue } from '@/shared/ui/file-upload';
import { type DateRange } from 'react-day-picker';

/**
 * 복잡한 타입의 폼 필드를 위한 Zod 스키마 프리셋
 *
 * 단순한 검증(string, email 등)은 Zod를 직접 사용하세요.
 * 이 프리셋은 타입이 복잡하거나 검증 로직이 까다로운 경우에만 사용합니다.
 *
 * @example
 * ```tsx
 * import { schemaPresets } from '@/shared/schemas/field-schemas';
 *
 * const schema = z.object({
 *   name: z.string().min(1, '이름을 입력하세요'),  // 직접 작성
 *   email: z.string().email('유효한 이메일'),       // 직접 작성
 *   files: schemaPresets.fileUpload(1),              // 프리셋 사용
 *   dateRange: schemaPresets.dateRange,              // 프리셋 사용
 * });
 * ```
 */
export const schemaPresets = {
  /**
   * 파일 업로드 검증
   * @param min 최소 파일 개수 (기본값: 1)
   */
  fileUpload: (min = 1) =>
    z.array(z.custom<FormFileValue>()).refine(
      files => {
        const validFiles = files.filter(f => {
          if (!f) return false;
          if (f.type === 'existing' && f.markedForDeletion) return false;
          return true;
        });
        return validFiles.length >= min;
      },
      {
        message: min === 1 ? '파일을 업로드해주세요' : `최소 ${min}개 이상의 파일을 업로드해주세요`,
      }
    ),

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
