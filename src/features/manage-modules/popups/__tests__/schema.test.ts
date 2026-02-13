import { writeSchema } from '../schema';

describe('popups writeSchema', () => {
  const validData = {
    title: '팝업 제목',
    content: '팝업 내용입니다.',
    position_top: 100,
    position_left: 200,
    width: 500,
    is_active: true,
    is_always: false,
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-12-31'),
    z_index: 10,
  };

  it('유효한 데이터 → 성공', () => {
    const result = writeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('start_date, end_date가 null/undefined → 성공 (nullish)', () => {
    const data = { ...validData, start_date: null, end_date: undefined };
    expect(writeSchema.safeParse(data).success).toBe(true);
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

  describe('숫자 필드 검증', () => {
    it('position_top 음수 → 실패', () => {
      const result = writeSchema.safeParse({ ...validData, position_top: -1 });
      expect(result.success).toBe(false);
    });

    it('position_left 음수 → 실패', () => {
      const result = writeSchema.safeParse({ ...validData, position_left: -1 });
      expect(result.success).toBe(false);
    });

    it('width 0 → 실패 (min 1)', () => {
      const result = writeSchema.safeParse({ ...validData, width: 0 });
      expect(result.success).toBe(false);
    });

    it('width 1 → 성공', () => {
      const result = writeSchema.safeParse({ ...validData, width: 1 });
      expect(result.success).toBe(true);
    });

    it('z_index 0 → 성공', () => {
      const result = writeSchema.safeParse({ ...validData, z_index: 0 });
      expect(result.success).toBe(true);
    });

    it('소수점 → 실패 (int 필수)', () => {
      expect(writeSchema.safeParse({ ...validData, position_top: 1.5 }).success).toBe(false);
      expect(writeSchema.safeParse({ ...validData, width: 100.1 }).success).toBe(false);
      expect(writeSchema.safeParse({ ...validData, z_index: 0.5 }).success).toBe(false);
    });
  });

  describe('날짜 필드 검증', () => {
    it('Date 객체 → 성공', () => {
      const result = writeSchema.safeParse({
        ...validData,
        start_date: new Date(),
        end_date: new Date(),
      });
      expect(result.success).toBe(true);
    });

    it('문자열 → 실패', () => {
      expect(writeSchema.safeParse({ ...validData, start_date: '2024-01-01' }).success).toBe(false);
      expect(writeSchema.safeParse({ ...validData, end_date: '2024-12-31' }).success).toBe(false);
    });
  });

  describe('타입 불일치 → 실패', () => {
    it('is_active가 문자열', () => {
      const result = writeSchema.safeParse({ ...validData, is_active: 'true' });
      expect(result.success).toBe(false);
    });

    it('is_always가 숫자', () => {
      const result = writeSchema.safeParse({ ...validData, is_always: 1 });
      expect(result.success).toBe(false);
    });

    it('position_top이 문자열', () => {
      const result = writeSchema.safeParse({ ...validData, position_top: '100' });
      expect(result.success).toBe(false);
    });
  });
});
