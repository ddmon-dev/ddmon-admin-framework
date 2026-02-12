import { createReply } from '../create-reply';
import { sendEmail } from '@/shared/lib/email/send-email';

// Supabase 체이닝 모킹 — 복수 테이블 대응
const mockInquirySingle = vi.fn();
const mockInquiryEq = vi.fn(() => ({ single: mockInquirySingle }));
const mockInquirySelect = vi.fn(() => ({ eq: mockInquiryEq }));

const mockReplySingle = vi.fn();
const mockReplySelect = vi.fn(() => ({ single: mockReplySingle }));
const mockReplyInsert = vi.fn(() => ({ select: mockReplySelect }));

const mockStatusEq = vi.fn();
const mockStatusUpdate = vi.fn(() => ({ eq: mockStatusEq }));

const mockFrom = vi.fn((table: string) => {
  if (table === 'inquiry_replies') {
    return { insert: mockReplyInsert };
  }
  // inquiries 테이블 — select vs update 구분
  return {
    select: mockInquirySelect,
    update: mockStatusUpdate,
  };
});

vi.mock('@/shared/lib/supabase/server', () => ({
  createServerClient: vi.fn(() => ({ from: mockFrom })),
}));

vi.mock('@/features/auth/utils/server', () => ({
  getUserSession: vi.fn(() => ({ id: 'admin1', name: '관리자' })),
}));

vi.mock('@/shared/lib/email/send-email', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('../../reply-email', () => ({
  getReplyEmailSubject: vi.fn(() => '답변 제목'),
  getReplyEmailHtml: vi.fn(() => '<p>답변</p>'),
}));

const validParams = {
  inquiryId: 'inq-1',
  content: '답변 내용입니다.',
  pathname: '/admin/inquiries',
};

const mockInquiry = {
  name: '홍길동',
  email: 'user@example.com',
  content: '문의 내용입니다.',
};

const mockReplyData = {
  id: 'reply-1',
  inquiry_id: 'inq-1',
  content: '답변 내용입니다.',
  author: '관리자',
  sent_at: expect.any(String),
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

const { revalidatePath } = await import('next/cache');

describe('inquiries/createReply', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('정상 흐름 → 문의 조회 → 이메일 발송 → 답변 저장 → 상태 업데이트', async () => {
    mockInquirySingle.mockResolvedValue({ data: mockInquiry, error: null });
    mockReplySingle.mockResolvedValue({ data: mockReplyData, error: null });
    mockStatusEq.mockResolvedValue({ error: null });

    const result = await createReply(validParams);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockReplyData);
    }

    // 이메일 발송 확인
    expect(sendEmail).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: '답변 제목',
      html: '<p>답변</p>',
    });

    // 상태 업데이트 확인
    expect(mockStatusUpdate).toHaveBeenCalledWith({ status: 'answered' });
    expect(mockStatusEq).toHaveBeenCalledWith('id', 'inq-1');

    // revalidatePath 호출 확인
    expect(revalidatePath).toHaveBeenCalledWith('/admin/inquiries');
  });

  it('스키마 검증 실패 → INVALID_INPUT 반환', async () => {
    const result = await createReply({ inquiryId: '', content: '', pathname: '' });

    expect(result).toEqual({ success: false, error: '입력값이 올바르지 않습니다.' });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('미로그인 → 로그인 필요 에러 반환', async () => {
    const { getUserSession } = await import('@/features/auth/utils/server');
    vi.mocked(getUserSession).mockResolvedValueOnce(null);

    const result = await createReply(validParams);

    expect(result).toEqual({ success: false, error: '로그인이 필요합니다.' });
  });

  it('문의 조회 실패 → READ_FAILED(문의) 반환', async () => {
    mockInquirySingle.mockResolvedValue({
      data: null,
      error: { message: 'not found' },
    });

    const result = await createReply(validParams);

    expect(result).toEqual({
      success: false,
      error: '문의를 조회하는 중 오류가 발생했습니다.',
    });
  });

  it('이메일 발송 실패 → 이메일 에러 반환, DB 저장 안 됨', async () => {
    mockInquirySingle.mockResolvedValue({ data: mockInquiry, error: null });
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error('SMTP error'));

    const result = await createReply(validParams);

    expect(result).toEqual({
      success: false,
      error: '이메일 발송에 실패했습니다. 답변이 저장되지 않았습니다.',
    });
    // 이메일 실패 후 DB insert 호출 안 됨
    expect(mockReplyInsert).not.toHaveBeenCalled();
  });

  it('답변 저장 실패 → CREATE_FAILED(답변) 반환', async () => {
    mockInquirySingle.mockResolvedValue({ data: mockInquiry, error: null });
    mockReplySingle.mockResolvedValue({
      data: null,
      error: { message: 'insert failed' },
    });

    const result = await createReply(validParams);

    expect(result).toEqual({
      success: false,
      error: '답변을 생성하는 중 오류가 발생했습니다.',
    });
  });

  it('상태 업데이트 실패 → UPDATE_FAILED(문의 상태) 반환', async () => {
    mockInquirySingle.mockResolvedValue({ data: mockInquiry, error: null });
    mockReplySingle.mockResolvedValue({ data: mockReplyData, error: null });
    mockStatusEq.mockResolvedValue({
      error: { message: 'update failed' },
    });

    const result = await createReply(validParams);

    expect(result).toEqual({
      success: false,
      error: '문의 상태를 수정하는 중 오류가 발생했습니다.',
    });
  });

  it('예외 발생 → GENERAL_ERRORS.UNEXPECTED 반환', async () => {
    mockInquirySingle.mockRejectedValue(new Error('unexpected'));

    const result = await createReply(validParams);

    expect(result).toEqual({
      success: false,
      error: '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  });
});
