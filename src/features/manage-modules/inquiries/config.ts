import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../_base/types';

export const CONFIG = {
  title: '',
  moduleName: '문의',
  tableName: 'inquiries',
  replyTableName: 'inquiry_replies',
  enableBulkAction: true,
  statusOptions: [
    { value: 'pending', label: '대기' },
    { value: 'answered', label: '답변완료' },
  ],
} as const;

// 상태 뱃지 설정
export const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'secondary' }
> = {
  pending: { label: '대기', variant: 'secondary' },
  answered: { label: '답변완료', variant: 'default' },
};

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;

// 답변 관련 타입 (inquiry_replies 테이블)
export interface ReplyRowData {
  id: string;
  inquiry_id: string;
  content: string;
  author: string;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InquiryWithReplies extends ItemDTO {
  replies: ReplyRowData[];
}
