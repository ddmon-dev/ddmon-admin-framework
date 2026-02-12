import { createSchema, updateSchema } from '../schema';

describe('admins createSchema', () => {
  const validData = {
    id: 'admin01',
    name: '홍길동',
    password: 'pass123',
    email: 'admin@example.com',
  };

  it('유효한 데이터 → 성공', () => {
    const result = createSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('id 검증', () => {
    it('5자 미만 → 실패', () => {
      const result = createSchema.safeParse({ ...validData, id: 'ab12' });
      expect(result.success).toBe(false);
    });

    it('5자 이상 영문+숫자 → 성공', () => {
      const result = createSchema.safeParse({ ...validData, id: 'admin' });
      expect(result.success).toBe(true);
    });

    it('특수문자 포함 → 실패', () => {
      const result = createSchema.safeParse({ ...validData, id: 'admin@1' });
      expect(result.success).toBe(false);
    });

    it('한글 포함 → 실패', () => {
      const result = createSchema.safeParse({ ...validData, id: 'admin관리' });
      expect(result.success).toBe(false);
    });
  });

  describe('name 검증', () => {
    it('3자 미만 → 실패', () => {
      const result = createSchema.safeParse({ ...validData, name: '홍길' });
      expect(result.success).toBe(false);
    });

    it('3자 이상 → 성공', () => {
      const result = createSchema.safeParse({ ...validData, name: '홍길동' });
      expect(result.success).toBe(true);
    });
  });

  describe('password 검증 (strength: minimum, 필수)', () => {
    it('6자 이상 → 성공', () => {
      const result = createSchema.safeParse({ ...validData, password: '123456' });
      expect(result.success).toBe(true);
    });

    it('5자 → 실패', () => {
      const result = createSchema.safeParse({ ...validData, password: '12345' });
      expect(result.success).toBe(false);
    });

    it('빈 문자열 → 실패 (필수)', () => {
      const result = createSchema.safeParse({ ...validData, password: '' });
      expect(result.success).toBe(false);
    });

    it('64자 초과 → 실패', () => {
      const result = createSchema.safeParse({ ...validData, password: 'a'.repeat(65) });
      expect(result.success).toBe(false);
    });
  });

  describe('email 검증', () => {
    it('유효한 이메일 → 성공', () => {
      const result = createSchema.safeParse({ ...validData, email: 'test@test.com' });
      expect(result.success).toBe(true);
    });

    it('잘못된 이메일 형식 → 실패', () => {
      const result = createSchema.safeParse({ ...validData, email: 'not-email' });
      expect(result.success).toBe(false);
    });
  });

  describe('타입 불일치 → 실패', () => {
    it('id가 숫자', () => {
      const result = createSchema.safeParse({ ...validData, id: 12345 });
      expect(result.success).toBe(false);
    });

    it('password가 숫자', () => {
      const result = createSchema.safeParse({ ...validData, password: 123456 });
      expect(result.success).toBe(false);
    });
  });
});

describe('admins updateSchema', () => {
  const validData = {
    name: '홍길동',
    password: 'pass123',
    email: 'admin@example.com',
  };

  it('유효한 데이터 → 성공', () => {
    const result = updateSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('password optional 검증', () => {
    it('빈 문자열 → 성공', () => {
      const result = updateSchema.safeParse({ ...validData, password: '' });
      expect(result.success).toBe(true);
    });

    it('null → 성공', () => {
      const result = updateSchema.safeParse({ ...validData, password: null });
      expect(result.success).toBe(true);
    });

    it('undefined → 성공', () => {
      const result = updateSchema.safeParse({ ...validData, password: undefined });
      expect(result.success).toBe(true);
    });

    it('6자 이상 → 성공', () => {
      const result = updateSchema.safeParse({ ...validData, password: 'newpass' });
      expect(result.success).toBe(true);
    });

    it('1~5자 → 실패 (최소 6자)', () => {
      const result = updateSchema.safeParse({ ...validData, password: '12345' });
      expect(result.success).toBe(false);
    });
  });

  describe('name 검증', () => {
    it('3자 미만 → 실패', () => {
      const result = updateSchema.safeParse({ ...validData, name: '홍' });
      expect(result.success).toBe(false);
    });
  });

  describe('email 검증', () => {
    it('잘못된 형식 → 실패', () => {
      const result = updateSchema.safeParse({ ...validData, email: 'invalid' });
      expect(result.success).toBe(false);
    });
  });
});
