import { z } from 'zod';
import { FILE_ERRORS } from '@/shared/constants/error-messages';

/* *
 * 기존에 DB에 저장된 파일 메타 데이터 스키마 +
 * 클라이언트의 폼에서 컨트롤 (삭제) 하기 위한 옵션 필드 (markedForDeletion)
 */
const previousFileData = z.object({
  type: z.literal('existing'),
  url: z.string(),
  originalName: z.string(),
  size: z.number(),
  mimeType: z.string(),
  uploadedAt: z.string(),
  markedForDeletion: z.boolean().optional(),
});

// 클라이언트의 폼에서 새로 업로드할 파일 데이터 스키마 (파일 객체)
const newFileData = z.object({
  type: z.literal('new'),
  file: z.instanceof(File),
});

/**
 * 파일 업로드 값 스키마
 * 기존 파일 스키마와 새 파일 스키마를 유니온 타입으로 검증합니다.
 */
const fileUploadValueSchema = z.union([previousFileData, newFileData, z.null()]);

/**
 * 카테고리별 파일 그룹 스키마 생성 함수
 *
 * @param config - 파일 카테고리 배열 또는 카테고리별 설정 객체
 * @returns 카테고리별로 파일 배열을 가진 객체 스키마
 *
 * @example
 * // 간단 사용 (모두 선택)
 * const formSchema = z.object({
 *   files: createFilesSchema(['thumbnail', 'attachments'])
 * });
 *
 * @example
 * // 고급 사용 (카테고리별 최소 개수 지정)
 * const formSchema = z.object({
 *   files: createFilesSchema({
 *     thumbnail: 1,        // 필수, 최소 1개
 *     attachments: 0,      // 선택 (min: 0 → optional: true)
 *   })
 * });
 */
export function createFilesSchema(config: string[] | Record<string, number | { min?: number }>) {
  // 배열인 경우 → 모두 선택 (min: 0)
  if (Array.isArray(config)) {
    const configObj = config.reduce(
      (acc, category) => {
        acc[category] = 0;
        return acc;
      },
      {} as Record<string, number>
    );
    return createFilesSchema(configObj);
  }

  // 객체를 Zod 스키마로 변환
  const filesObject = Object.entries(config).reduce(
    (acc, [category, minOrConfig]) => {
      const min = typeof minOrConfig === 'number' ? minOrConfig : (minOrConfig.min ?? 0);
      const optional = min === 0;

      // 파일 배열 검증 (markedForDeletion 제외한 유효 파일 체크)
      const schema = z.array(fileUploadValueSchema, { message: FILE_ERRORS.REQUIRED_FILES }).refine(
        (files) => {
          const validFiles = files.filter((f) => {
            if (!f) return false;
            if (f.type === 'existing' && f.markedForDeletion) return false;
            return true;
          });
          return validFiles.length >= min;
        },
        {
          message:
            min === 1
              ? FILE_ERRORS.REQUIRED_FILES
              : min > 1
                ? FILE_ERRORS.MIN_FILES_REQUIRED(min)
                : undefined,
        }
      );

      acc[category] = optional ? schema.optional() : schema;
      return acc;
    },
    {} as Record<string, any>
  );

  return z.object(filesObject).optional();
}

/**
 * DB files JSONB 컬럼에 저장되는 파일 메타데이터 스키마
 *
 * 서버 액션 검증(writeSchema)에 포함해 update 시 files 필드가
 * 스키마 검증에서 제거되지 않도록 합니다.
 */
export const dbFilesSchema = z.record(
  z.string(),
  z.array(
    z.object({
      url: z.string(),
      originalName: z.string(),
      size: z.number(),
      mimeType: z.string(),
      uploadedAt: z.string(),
    })
  )
);
