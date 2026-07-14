import { z } from 'zod';
import { createItem } from '../create-item';

// Supabase 체이닝 모킹
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockLimit = vi.fn(() => ({ single: vi.fn() }));
const mockOrder = vi.fn(() => ({ limit: mockLimit }));
const mockEq = vi.fn(() => ({ order: mockOrder }));
const mockReorderSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn((_table: string) => ({
  insert: mockInsert,
  select: mockReorderSelect,
}));

vi.mock('@/shared/lib/supabase/server', () => ({
  createServerClient: vi.fn(() => ({ from: mockFrom })),
}));

vi.mock('@/features/auth', () => ({
  requireAuth: vi.fn(() => ({ id: 'admin1', name: '관리자' })),
}));

const { revalidatePath } = await import('next/cache');

const testSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

describe('createItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('schema 있을 때 유효한 데이터 → DB insert 성공, author 자동 주입', async () => {
    const mockData = {
      id: '1',
      title: '테스트',
      content: '내용',
      author: 'admin1',
    };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await createItem(
      { tableName: 'faqs', schema: testSchema },
      { values: { title: '테스트', content: '내용' } }
    );

    expect(result).toEqual({ success: true, data: mockData });
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '테스트',
        content: '내용',
        author: 'admin1',
      })
    );
  });

  it('schema 있을 때 잘못된 데이터 → VALIDATION_ERRORS.INVALID_INPUT 반환, DB 호출 안 됨', async () => {
    const result = await createItem(
      { tableName: 'faqs', schema: testSchema },
      { values: { title: '', content: '' } }
    );

    expect(result).toEqual({ success: false, error: '입력값이 올바르지 않습니다.' });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('schema 없을 때 → 검증 스킵, DB insert 진행', async () => {
    const mockData = { id: '2', title: '아무값', author: 'admin1' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await createItem({ tableName: 'faqs' }, { values: { title: '아무값' } });

    expect(result).toEqual({ success: true, data: mockData });
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ title: '아무값', author: 'admin1' })
    );
  });

  it('enableReorder=true → sort_order 계산 (max+1)', async () => {
    // reorder 쿼리 결과: 현재 max sort_order = 5
    mockLimit.mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: { sort_order: 5 } }),
    });
    const mockData = {
      id: '3',
      title: '순서 테스트',
      sort_order: 6,
      author: 'admin1',
    };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await createItem(
      { tableName: 'faqs', enableReorder: true },
      { values: { title: '순서 테스트' } }
    );

    expect(result).toEqual({ success: true, data: mockData });
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ sort_order: 6, author: 'admin1' })
    );
  });

  it('pathname 있을 때 → revalidatePath 호출', async () => {
    const mockData = { id: '4', title: '경로 테스트', author: 'admin1' };
    mockSingle.mockResolvedValue({ data: mockData, error: null });

    await createItem(
      { tableName: 'faqs' },
      { values: { title: '경로 테스트' }, pathname: '/admin/faqs' }
    );

    expect(revalidatePath).toHaveBeenCalledWith('/admin/faqs');
  });

  it('DB 에러 시 → CRUD_ERRORS.CREATE_FAILED() 반환', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'DB error' } });

    const result = await createItem({ tableName: 'faqs' }, { values: { title: '에러 테스트' } });

    expect(result).toEqual({
      success: false,
      error: '데이터를 생성하는 중 오류가 발생했습니다.',
    });
  });
});
