import { z } from 'zod';

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
 * @param categories - 파일 카테고리 배열 (예: ['thumbnail', 'attachments'])
 * @returns 카테고리별로 파일 배열을 가진 객체 스키마
 *
 * @example
 * const formSchema = z.object({
 *   title: z.string(),
 *   content: z.string(),
 *   files: createFilesSchema(['thumbnail', 'attachments'])   // files: { thumbnail: [], attachments: [] }
 * });
 */
export function createFilesSchema(categories: string[]) {
  const filesObject = categories.reduce((acc, category) => {
    acc[category] = z.array(fileUploadValueSchema).optional();
    return acc;
  }, {} as Record<string, any>);

  const schema = z.object(filesObject).optional();

  return schema;
}
