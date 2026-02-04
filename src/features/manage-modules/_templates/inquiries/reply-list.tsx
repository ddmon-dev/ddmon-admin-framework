import { format } from 'date-fns';
import { FieldGroup } from '@/shared/ui/field';
import { Badge } from '@/shared/ui/badge';
import { Mail, MailX } from 'lucide-react';
import { type ReplyRowData } from './config';

interface ReplyListProps {
  replies: ReplyRowData[];
}

export function ReplyList({ replies }: ReplyListProps) {
  if (replies.length === 0) {
    return (
      <FieldGroup>
        <div className='rounded-md border border-dashed p-6 text-center text-muted-foreground'>
          아직 등록된 답변이 없습니다.
        </div>
      </FieldGroup>
    );
  }

  return (
    <FieldGroup>
      <div className='space-y-4'>
        <h3 className='text-sm font-medium'>답변 히스토리 ({replies.length})</h3>
        {replies.map((reply) => (
          <div
            key={reply.id}
            className='rounded-md border bg-card p-4'
          >
            <div className='mb-2 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>{reply.author}</span>
                <span className='text-xs text-muted-foreground'>
                  {format(reply.created_at, 'yyyy-MM-dd HH:mm')}
                </span>
              </div>
              {reply.sent_at ? (
                <Badge variant='outline' className='gap-1'>
                  <Mail className='size-3' />
                  발송완료
                </Badge>
              ) : (
                <Badge variant='secondary' className='gap-1'>
                  <MailX className='size-3' />
                  미발송
                </Badge>
              )}
            </div>
            <p className='whitespace-pre-wrap text-sm'>{reply.content}</p>
          </div>
        ))}
      </div>
    </FieldGroup>
  );
}
