import { format } from 'date-fns';
import { Badge } from '@/shared/ui/badge';
import { type ItemDTO } from './config';

const statusVariants: Record<string, 'default' | 'secondary'> = {
  pending: 'secondary',
  answered: 'default',
};

const statusLabels: Record<string, string> = {
  pending: '대기',
  answered: '답변완료',
};

interface InquiryInfoProps {
  data: ItemDTO;
}

export function InquiryInfo({ data }: InquiryInfoProps) {
  return (
    <div className='space-y-4'>
      {/* 문의 정보 테이블 */}
      <div className='rounded-md border'>
        <table className='w-full text-sm'>
          <tbody className='divide-y'>
            <tr>
              <th className='w-24 bg-muted/50 px-4 py-2.5 text-left font-medium'>이름</th>
              <td className='px-4 py-2.5'>{data.name}</td>
            </tr>
            <tr>
              <th className='bg-muted/50 px-4 py-2.5 text-left font-medium'>이메일</th>
              <td className='px-4 py-2.5'>{data.email}</td>
            </tr>
            {data.phone && (
              <tr>
                <th className='bg-muted/50 px-4 py-2.5 text-left font-medium'>연락처</th>
                <td className='px-4 py-2.5'>{data.phone}</td>
              </tr>
            )}
            {data.company && (
              <tr>
                <th className='bg-muted/50 px-4 py-2.5 text-left font-medium'>회사</th>
                <td className='px-4 py-2.5'>{data.company}</td>
              </tr>
            )}
            {data.position && (
              <tr>
                <th className='bg-muted/50 px-4 py-2.5 text-left font-medium'>직책</th>
                <td className='px-4 py-2.5'>{data.position}</td>
              </tr>
            )}
            <tr>
              <th className='bg-muted/50 px-4 py-2.5 text-left font-medium'>접수일</th>
              <td className='px-4 py-2.5'>
                <div className='flex items-center justify-between'>
                  <span>{format(data.created_at, 'yyyy-MM-dd HH:mm')}</span>
                  <Badge variant={statusVariants[data.status] || 'secondary'}>
                    {statusLabels[data.status] || data.status}
                  </Badge>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 문의 내용 */}
      <div>
        <h3 className='mb-2 text-sm font-medium'>문의 내용</h3>
        <div className='rounded-md border bg-muted/30 p-4'>
          <p className='whitespace-pre-wrap text-sm'>{data.content}</p>
        </div>
      </div>
    </div>
  );
}
