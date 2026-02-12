import { updateProfile } from '../update-profile';
import { verifyPassword } from '../../utils/password';

// Supabase 체이닝 모킹
const mockSingle = vi.fn();
const mockEqForSelect = vi.fn(() => ({ single: mockSingle }));
const mockSelectForRead = vi.fn(() => ({ eq: mockEqForSelect }));
const mockEqForUpdate = vi.fn();
const mockUpdate = vi.fn(() => ({ eq: mockEqForUpdate }));
const mockFrom = vi.fn(() => ({
  select: mockSelectForRead,
  update: mockUpdate,
}));

vi.mock('@/shared/lib/supabase/server', () => ({
  createServerClient: vi.fn(() => ({ from: mockFrom })),
}));

vi.mock('../../utils/server', () => ({
  requireAuth: vi.fn(() => ({ id: 'admin1', name: '관리자' })),
}));

vi.mock('../../utils/password', () => ({
  hashPassword: vi.fn((pw: string) => `hashed_${pw}`),
  verifyPassword: vi.fn(),
}));

const baseValues = {
  name: '수정관리자',
  email: 'updated@example.com',
};

describe('updateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('이름/이메일만 변경 (비밀번호 없음) → DB update 성공', async () => {
    mockEqForUpdate.mockResolvedValue({ error: null });

    const result = await updateProfile(baseValues);

    expect(result).toEqual({ success: true, data: undefined });
    expect(mockUpdate).toHaveBeenCalledWith({
      name: '수정관리자',
      email: 'updated@example.com',
    });
    // 비밀번호 변경 없으므로 select (비밀번호 조회) 호출 안 됨
    expect(mockSelectForRead).not.toHaveBeenCalled();
  });

  it('스키마 검증 실패 → INVALID_INPUT 반환', async () => {
    const result = await updateProfile({ name: '짧', email: 'invalid' });

    expect(result).toEqual({ success: false, error: '입력값이 올바르지 않습니다.' });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('새 비밀번호만 있고 현재 비밀번호 없음 → REQUIRED_FIELD 반환', async () => {
    const result = await updateProfile({
      ...baseValues,
      newPassword: 'newpass123',
    });

    expect(result).toEqual({
      success: false,
      error: '현재 비밀번호는 필수 입력값입니다.',
    });
  });

  it('비밀번호 변경 → 현재 비밀번호 검증 성공 → 해시 후 update', async () => {
    vi.mocked(verifyPassword).mockResolvedValue(true);
    mockSingle.mockResolvedValue({ data: { password: 'old_hashed' }, error: null });
    mockEqForUpdate.mockResolvedValue({ error: null });

    const result = await updateProfile({
      ...baseValues,
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
    });

    expect(result).toEqual({ success: true, data: undefined });
    expect(verifyPassword).toHaveBeenCalledWith('oldpass', 'old_hashed');
    expect(mockUpdate).toHaveBeenCalledWith({
      name: '수정관리자',
      email: 'updated@example.com',
      password: 'hashed_newpass123',
    });
  });

  it('현재 비밀번호 불일치 → 에러 반환', async () => {
    vi.mocked(verifyPassword).mockResolvedValue(false);
    mockSingle.mockResolvedValue({ data: { password: 'old_hashed' }, error: null });

    const result = await updateProfile({
      ...baseValues,
      currentPassword: 'wrongpass',
      newPassword: 'newpass123',
    });

    expect(result).toEqual({ success: false, error: '현재 비밀번호가 일치하지 않습니다.' });
  });

  it('비밀번호 조회 실패 → NOT_FOUND 반환', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'not found' } });

    const result = await updateProfile({
      ...baseValues,
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
    });

    expect(result).toEqual({ success: false, error: '사용자 정보를 찾을 수 없습니다.' });
  });

  it('이메일 중복(23505) → ALREADY_EXISTS(이메일) 반환', async () => {
    mockEqForUpdate.mockResolvedValue({
      error: { code: '23505', details: 'Key (email) already exists.' },
    });

    const result = await updateProfile(baseValues);

    expect(result).toEqual({ success: false, error: '이미 사용된 이메일입니다.' });
  });

  it('기타 DB 에러 → UPDATE_FAILED(프로필) 반환', async () => {
    mockEqForUpdate.mockResolvedValue({
      error: { code: '42P01', message: 'relation does not exist' },
    });

    const result = await updateProfile(baseValues);

    expect(result).toEqual({
      success: false,
      error: '프로필을 수정하는 중 오류가 발생했습니다.',
    });
  });

  it('예외 발생 → GENERAL_ERRORS.UNEXPECTED 반환', async () => {
    mockEqForUpdate.mockRejectedValue(new Error('unexpected'));

    const result = await updateProfile(baseValues);

    expect(result).toEqual({
      success: false,
      error: '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  });
});
