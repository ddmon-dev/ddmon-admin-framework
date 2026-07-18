import { z } from 'zod';
import { dbFilesSchema } from '@/shared/lib/file-system';
import type { ZodType } from 'zod';

/**
 * 폼 스키마의 files 필드를 서버 검증용 dbFiles 메타데이터 스키마로 치환한다.
 *
 * 모듈은 폼 스키마(files는 new/existing/null 폼 모양) 하나만 선언한다.
 * 업로드가 선행된 뒤 서버 액션에 도달하는 files는 이미 DB 메타데이터 모양이므로,
 * 검증 직전에 이 함수로 files 필드만 dbFilesSchema로 덮어쓴다.
 *
 * files 필드가 없거나(파일 미사용 모듈) ZodObject가 아닌(refine 래핑 등) 스키마는
 * 그대로 반환한다(항등).
 */
export function resolveServerSchema(schema: ZodType): ZodType {
  if (schema instanceof z.ZodObject && 'files' in schema.shape) {
    return schema.extend({ files: dbFilesSchema.optional() });
  }
  return schema;
}
