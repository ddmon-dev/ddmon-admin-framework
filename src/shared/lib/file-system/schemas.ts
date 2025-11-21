import { z } from 'zod';

/**
 * 기존 파일 스키마
 */
const existingFileSchema = z.object({
  type: z.literal('existing'),
  url: z.string(),
  originalName: z.string(),
  markedForDeletion: z.boolean().optional(),
});

/**
 * 새 파일 스키마
 */
const newFileSchema = z.object({
  type: z.literal('new'),
  file: z.instanceof(File),
});

/**
 * 파일 업로드 값 스키마 (기존 파일 | 새 파일 | null)
 *
 * @example
 * // FormFileUpload 컴포넌트의 value 타입 검증에 사용
 * const schema = z.object({
 *   attachments: z.array(fileUploadValueSchema).optional(),
 * });
 */
export const fileUploadValueSchema = z.union([existingFileSchema, newFileSchema, z.null()]);

/**
 * 카테고리별 파일 그룹 스키마 생성 함수
 *
 * @param categories - 파일 카테고리 배열 (예: ['thumbnail', 'attachments'])
 * @returns 카테고리별로 파일 배열을 가진 객체 스키마
 *
 * @example
 * const formSchema = z.object({
 *   title: z.string(),
 *   content: z.string(),
 *   ...createFilesSchema(['thumbnail', 'attachments']),
 * });
 */
export function createFilesSchema(categories: string[]) {
  const filesObject = categories.reduce(
    (acc, category) => {
      acc[category] = z.array(fileUploadValueSchema).optional();
      return acc;
    },
    {} as Record<string, any>
  );

  return {
    files: z.object(filesObject).optional(),
  };
}
