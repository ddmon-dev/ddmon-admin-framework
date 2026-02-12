import { writeSchema } from '../schema';

describe('news writeSchema', () => {
  const validData = {
    created_at: new Date(),
    view_count: 50,
    title: '뉴스 제목',
    content: '뉴스 내용입니다.',
  };

  it('유효한 데이터 → 성공', () => {
    const result = writeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('created_at이 null/undefined → 성공 (nullish)', () => {
    expect(writeSchema.safeParse({ ...validData, created_at: null }).success).toBe(true);
    expect(writeSchema.safeParse({ ...validData, created_at: undefined }).success).toBe(true);
  });

  describe('필수 필드 누락 → 실패', () => {
    it('title 빈 문자열', () => {
      const result = writeSchema.safeParse({ ...validData, title: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
      }
    });

    it('content 빈 문자열', () => {
      const result = writeSchema.safeParse({ ...validData, content: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
      }
    });
  });

  describe('view_count 검증', () => {
    it('number 타입만 허용', () => {
      const result = writeSchema.safeParse({ ...validData, view_count: '50' });
      expect(result.success).toBe(false);
    });

    it('음수 → 실패', () => {
      const result = writeSchema.safeParse({ ...validData, view_count: -1 });
      expect(result.success).toBe(false);
    });

    it('0 → 성공', () => {
      const result = writeSchema.safeParse({ ...validData, view_count: 0 });
      expect(result.success).toBe(true);
    });

    it('999999999 → 성공 (최대값)', () => {
      const result = writeSchema.safeParse({ ...validData, view_count: 999999999 });
      expect(result.success).toBe(true);
    });

    it('1000000000 → 실패 (최대값 초과)', () => {
      const result = writeSchema.safeParse({ ...validData, view_count: 1000000000 });
      expect(result.success).toBe(false);
    });
  });

  describe('타입 불일치 → 실패', () => {
    it('title이 숫자', () => {
      const result = writeSchema.safeParse({ ...validData, title: 123 });
      expect(result.success).toBe(false);
    });

    it('created_at이 문자열', () => {
      const result = writeSchema.safeParse({ ...validData, created_at: '2024-01-01' });
      expect(result.success).toBe(false);
    });
  });
});
