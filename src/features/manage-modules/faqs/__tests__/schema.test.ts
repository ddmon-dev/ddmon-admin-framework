import { writeSchema } from '../schema';

describe('faqs writeSchema', () => {
  const validData = {
    category: '일반',
    question: '자주 묻는 질문입니다.',
    answer: '답변 내용입니다.',
  };

  it('유효한 데이터 → 성공', () => {
    const result = writeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('필수 필드 누락 → 실패', () => {
    it('category 누락', () => {
      const result = writeSchema.safeParse({ ...validData, category: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('category');
      }
    });

    it('question 누락', () => {
      const result = writeSchema.safeParse({ ...validData, question: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('question');
      }
    });

    it('answer 누락', () => {
      const result = writeSchema.safeParse({ ...validData, answer: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('answer');
      }
    });
  });

  describe('타입 불일치 → 실패', () => {
    it('category가 숫자', () => {
      const result = writeSchema.safeParse({ ...validData, category: 123 });
      expect(result.success).toBe(false);
    });

    it('question이 숫자', () => {
      const result = writeSchema.safeParse({ ...validData, question: 456 });
      expect(result.success).toBe(false);
    });

    it('answer가 boolean', () => {
      const result = writeSchema.safeParse({ ...validData, answer: true });
      expect(result.success).toBe(false);
    });
  });
});
