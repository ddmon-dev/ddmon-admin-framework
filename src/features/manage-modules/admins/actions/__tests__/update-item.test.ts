import { updateItem } from '../update-item';

// Supabase 체이닝 모킹
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockEq = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({
  update: mockUpdate,
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
  name: '수정관리자',
  password: 'newpass123',
  email: 'updated@example.com',
};

describe('admins/updateItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('id 없으면 → NO_ID 에러 반환', async () => {
    const result = await updateItem({ id: '', values: validValues });

    expect(result).toEqual({ success: false, error: 'ID값이 없습니다.' });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('유효한 데이터 + 비밀번호 있음 → 해시 후 DB update 성공', async () => {
    const mockData = { id: 'admin01', ...validValues, password: 'hashed_newpass123' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await updateItem({ id: 'admin01', values: validValues });

    expect(result).toEqual({ success: true, data: mockData });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '수정관리자',
        password: 'hashed_newpass123',
        email: 'updated@example.com',
      })
    );
  });

  it('비밀번호 빈 문자열 → password 필드 제거 후 update', async () => {
    const mockData = { id: 'admin01', name: '수정관리자', email: 'updated@example.com' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await updateItem({
      id: 'admin01',
      values: { ...validValues, password: '' },
    });

    expect(result).toEqual({ success: true, data: mockData });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.not.objectContaining({ password: expect.anything() })
    );
  });

  it('스키마 검증 실패 → INVALID_INPUT 반환, DB 호출 안 됨', async () => {
    const result = await updateItem({
      id: 'admin01',
      values: { name: '짧', password: '', email: 'invalid' },
    });

    expect(result).toEqual({ success: false, error: '입력값이 올바르지 않습니다.' });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('아이디 중복(23505, id) → ALREADY_EXISTS(아이디) 반환', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: '23505', details: 'Key (id)=(admin01) already exists.' },
    });

    const result = await updateItem({ id: 'admin01', values: validValues });

    expect(result).toEqual({ success: false, error: '이미 사용된 아이디입니다.' });
  });

  it('이메일 중복(23505, email) → ALREADY_EXISTS(이메일) 반환', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: '23505', details: 'Key (email)=(test@example.com) already exists.' },
    });

    const result = await updateItem({ id: 'admin01', values: validValues });

    expect(result).toEqual({ success: false, error: '이미 사용된 이메일입니다.' });
  });

  it('기타 DB 에러 → UPDATE_FAILED(관리자) 반환', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: '42P01', message: 'relation does not exist' },
    });

    const result = await updateItem({ id: 'admin01', values: validValues });

    expect(result).toEqual({
      success: false,
      error: '관리자를 수정하는 중 오류가 발생했습니다.',
    });
  });

  it('pathname 있을 때 → revalidatePath 호출', async () => {
    const mockData = { id: 'admin01', ...validValues };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    await updateItem({ id: 'admin01', values: validValues, pathname: '/admin/admins' });

    expect(revalidatePath).toHaveBeenCalledWith('/admin/admins');
  });

  it('예외 발생 → GENERAL_ERRORS.UNEXPECTED 반환', async () => {
    mockSingle.mockRejectedValue(new Error('unexpected'));

    const result = await updateItem({ id: 'admin01', values: validValues });

    expect(result).toEqual({
      success: false,
      error: '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  });
});
