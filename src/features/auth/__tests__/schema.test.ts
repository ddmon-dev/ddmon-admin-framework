import { updateProfileSchema } from '../schema';

describe('auth updateProfileSchema', () => {
  const validData = {
    name: '홍길동',
    email: 'user@example.com',
    currentPassword: '',
    newPassword: '',
  };

  it('유효한 데이터 → 성공', () => {
    const result = updateProfileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('name 검증', () => {
    it('3자 미만 → 실패', () => {
      const result = updateProfileSchema.safeParse({ ...validData, name: '홍길' });
      expect(result.success).toBe(false);
    });

    it('3자 이상 → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, name: '홍길동' });
      expect(result.success).toBe(true);
    });

    it('빈 문자열 → 실패', () => {
      const result = updateProfileSchema.safeParse({ ...validData, name: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('email 검증', () => {
    it('유효한 이메일 → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, email: 'test@test.com' });
      expect(result.success).toBe(true);
    });

    it('잘못된 형식 → 실패', () => {
      const result = updateProfileSchema.safeParse({ ...validData, email: 'invalid-email' });
      expect(result.success).toBe(false);
    });
  });

  describe('currentPassword optional 검증', () => {
    it('빈 문자열 → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, currentPassword: '' });
      expect(result.success).toBe(true);
    });

    it('null → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, currentPassword: null });
      expect(result.success).toBe(true);
    });

    it('undefined → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, currentPassword: undefined });
      expect(result.success).toBe(true);
    });

    it('6자 이상 → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, currentPassword: 'mypass1' });
      expect(result.success).toBe(true);
    });

    it('1~5자 → 실패 (최소 6자)', () => {
      const result = updateProfileSchema.safeParse({ ...validData, currentPassword: '12345' });
      expect(result.success).toBe(false);
    });
  });

  describe('newPassword optional 검증', () => {
    it('빈 문자열 → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, newPassword: '' });
      expect(result.success).toBe(true);
    });

    it('null → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, newPassword: null });
      expect(result.success).toBe(true);
    });

    it('undefined → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, newPassword: undefined });
      expect(result.success).toBe(true);
    });

    it('6자 이상 → 성공', () => {
      const result = updateProfileSchema.safeParse({ ...validData, newPassword: 'newpw1' });
      expect(result.success).toBe(true);
    });

    it('1~5자 → 실패 (최소 6자)', () => {
      const result = updateProfileSchema.safeParse({ ...validData, newPassword: '123' });
      expect(result.success).toBe(false);
    });
  });

  describe('타입 불일치 → 실패', () => {
    it('name이 숫자', () => {
      const result = updateProfileSchema.safeParse({ ...validData, name: 12345 });
      expect(result.success).toBe(false);
    });

    it('email이 숫자', () => {
      const result = updateProfileSchema.safeParse({ ...validData, email: 12345 });
      expect(result.success).toBe(false);
    });
  });
});
