import { z } from 'zod';
import { updateItem } from '../update-item';

// Supabase 체이닝 모킹
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockEq = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({
  update: mockUpdate,
  select: vi.fn(),
}));

vi.mock('@/shared/lib/supabase/server', () => ({
  createServerClient: vi.fn(() => ({ from: mockFrom })),
}));

vi.mock('@/features/auth', () => ({
  requireAuth: vi.fn(() => ({ id: 'admin1', name: '관리자' })),
}));

vi.mock('@/shared/lib/file-system', () => ({
  getOldFiles: vi.fn(() => []),
  cleanupDeletedFiles: vi.fn(),
}));

const { revalidatePath } = await import('next/cache');
const { cleanupDeletedFiles } = await import('@/shared/lib/file-system');

const testSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

describe('updateItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('id 누락 → VALIDATION_ERRORS.NO_ID 반환', async () => {
    const result = await updateItem(
      { tableName: 'faqs' },
      { id: '', values: { title: '테스트' } }
    );

    expect(result).toEqual({ success: false, error: 'ID값이 없습니다.' });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('schema 있을 때 유효한 데이터 → DB update 성공, updated_by 자동 주입', async () => {
    const mockData = { id: '1', title: '수정됨', content: '내용', updated_by: '관리자', updated_by_id: 'admin1' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await updateItem(
      { tableName: 'faqs', schema: testSchema },
      { id: '1', values: { title: '수정됨', content: '내용' } }
    );

    expect(result).toEqual({ success: true, data: mockData });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: '수정됨', content: '내용', updated_by: '관리자', updated_by_id: 'admin1' })
    );
  });

  it('schema 있을 때 잘못된 데이터 → VALIDATION_ERRORS.INVALID_INPUT 반환', async () => {
    const result = await updateItem(
      { tableName: 'faqs', schema: testSchema },
      { id: '1', values: { title: '' } }
    );

    expect(result).toEqual({ success: false, error: '입력값이 올바르지 않습니다.' });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('schema 있을 때 부분 필드 → partial()로 성공', async () => {
    const mockData = { id: '1', title: '부분 수정', updated_by: '관리자', updated_by_id: 'admin1' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await updateItem(
      { tableName: 'faqs', schema: testSchema },
      { id: '1', values: { title: '부분 수정' } }
    );

    expect(result).toEqual({ success: true, data: mockData });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: '부분 수정', updated_by: '관리자', updated_by_id: 'admin1' })
    );
  });

  it('schema 없을 때 → 검증 스킵, DB update 진행', async () => {
    const mockData = { id: '2', title: '아무값', updated_by: '관리자', updated_by_id: 'admin1' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await updateItem(
      { tableName: 'faqs' },
      { id: '2', values: { title: '아무값' } }
    );

    expect(result).toEqual({ success: true, data: mockData });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: '아무값', updated_by: '관리자', updated_by_id: 'admin1' })
    );
  });

  it('pathname 있을 때 → revalidatePath 호출', async () => {
    const mockData = { id: '3', title: '경로', updated_by: '관리자', updated_by_id: 'admin1' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    await updateItem(
      { tableName: 'faqs' },
      { id: '3', values: { title: '경로' }, pathname: '/admin/faqs' }
    );

    expect(revalidatePath).toHaveBeenCalledWith('/admin/faqs');
  });

  it('DB 에러 → CRUD_ERRORS.UPDATE_FAILED() 반환', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'DB error' } });

    const result = await updateItem(
      { tableName: 'faqs' },
      { id: '1', values: { title: '에러 테스트' } }
    );

    expect(result).toEqual({
      success: false,
      error: '데이터를 수정하는 중 오류가 발생했습니다.',
    });
  });

  it('cleanupDeletedFiles 호출 확인', async () => {
    const mockData = { id: '4', title: '파일 정리', updated_by: '관리자', updated_by_id: 'admin1' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    await updateItem(
      { tableName: 'faqs' },
      { id: '4', values: { title: '파일 정리' } }
    );

    expect(cleanupDeletedFiles).toHaveBeenCalled();
  });
});
