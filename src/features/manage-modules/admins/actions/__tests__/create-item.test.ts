import { createItem } from '../create-item';

// Supabase 체이닝 모킹
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockFrom = vi.fn(() => ({
  insert: mockInsert,
}));

vi.mock('@/shared/lib/supabase/server', () => ({
  createServerClient: vi.fn(() => ({ from: mockFrom })),
}));

vi.mock('@/features/auth', () => ({
  requireAuth: vi.fn(),
  hashPassword: vi.fn((pw: string) => `hashed_${pw}`),
}));

const { revalidatePath } = await import('next/cache');

const validValues = {
  id: 'admin01',
  name: '테스트관리자',
  password: 'pass123',
  email: 'test@example.com',
};

describe('admins/createItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('유효한 데이터 → 비밀번호 해시 후 DB insert 성공', async () => {
    const mockData = { ...validValues, password: 'hashed_pass123' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await createItem({ values: validValues });

    expect(result).toEqual({ success: true, data: mockData });
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'admin01',
        name: '테스트관리자',
        password: 'hashed_pass123',
        email: 'test@example.com',
      })
    );
  });

  it('스키마 검증 실패 → INVALID_INPUT 반환, DB 호출 안 됨', async () => {
    const result = await createItem({
      values: { id: 'ab', name: '짧', password: '12', email: 'invalid' },
    });

    expect(result).toEqual({ success: false, error: '입력값이 올바르지 않습니다.' });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('아이디 중복(23505, id) → ALREADY_EXISTS(아이디) 반환', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: '23505', details: 'Key (id)=(admin01) already exists.' },
    });

    const result = await createItem({ values: validValues });

    expect(result).toEqual({ success: false, error: '이미 사용된 아이디입니다.' });
  });

  it('이메일 중복(23505, email) → ALREADY_EXISTS(이메일) 반환', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: '23505', details: 'Key (email)=(test@example.com) already exists.' },
    });

    const result = await createItem({ values: validValues });

    expect(result).toEqual({ success: false, error: '이미 사용된 이메일입니다.' });
  });

  it('기타 DB 에러 → CREATE_FAILED(관리자) 반환', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: '42P01', message: 'relation does not exist' },
    });

    const result = await createItem({ values: validValues });

    expect(result).toEqual({
      success: false,
      error: '관리자를 생성하는 중 오류가 발생했습니다.',
    });
  });

  it('pathname 있을 때 → revalidatePath 호출', async () => {
    const mockData = { ...validValues, password: 'hashed_pass123' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    await createItem({ values: validValues, pathname: '/admin/admins' });

    expect(revalidatePath).toHaveBeenCalledWith('/admin/admins');
  });

  it('pathname 없을 때 → revalidatePath 호출 안 됨', async () => {
    const mockData = { ...validValues, password: 'hashed_pass123' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    await createItem({ values: validValues });

    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('예외 발생 → GENERAL_ERRORS.UNEXPECTED 반환', async () => {
    mockSingle.mockRejectedValue(new Error('unexpected'));

    const result = await createItem({ values: validValues });

    expect(result).toEqual({
      success: false,
      error: '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  });
});
