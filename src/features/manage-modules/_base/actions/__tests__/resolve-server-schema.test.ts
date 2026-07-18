import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { schemaPresets } from '@/shared/schemas';
import { resolveServerSchema } from '../resolve-server-schema';

// 폼 스키마: files가 폼 모양(new/existing/null 유니온)
const formSchema = z.object({
  title: z.string().min(1),
  files: schemaPresets.files({ thumbnail: 1, attachments: 0 }),
});

// 업로드 완료 후 서버에 도달하는 값: files는 DB 메타데이터 모양
const uploadedMetadata = {
  title: '제목',
  files: {
    thumbnail: [
      { url: 'https://x/a.png', originalName: 'a.png', size: 71, mimeType: 'image/png', uploadedAt: '2026-07-18T00:00:00Z' },
    ],
  },
};

describe('resolveServerSchema', () => {
  it('폼 files 필드를 dbFiles로 치환 → 업로드 메타데이터가 검증 통과', () => {
    const result = resolveServerSchema(formSchema).safeParse(uploadedMetadata);
    expect(result.success).toBe(true);
  });

  it('치환 전(폼 스키마 원본)에는 메타데이터가 거부됨 → 치환이 실제로 일어남을 방증', () => {
    expect(formSchema.safeParse(uploadedMetadata).success).toBe(false);
  });

  it('files 없는 스키마는 그대로 반환(항등)', () => {
    const noFiles = z.object({ title: z.string().min(1) });
    expect(resolveServerSchema(noFiles)).toBe(noFiles);
  });

  it('ZodObject가 아닌 스키마(refine 래핑 등)는 그대로 반환(항등, 미크래시)', () => {
    const refined = z.object({ title: z.string() }).refine(() => true);
    expect(resolveServerSchema(refined)).toBe(refined);
  });

  it('치환 후에도 다른 필드 검증은 유지(title min)', () => {
    const result = resolveServerSchema(formSchema).safeParse({ ...uploadedMetadata, title: '' });
    expect(result.success).toBe(false);
  });
});
