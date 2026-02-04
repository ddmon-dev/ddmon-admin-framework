import { format } from 'date-fns';
import { NewlineText } from '@/shared/ui/newline-text';
import { DetailField, DetailGroup } from '../../_base/ui/manage-detail';
import { type ItemDTO } from './config';
import { StatusBadge } from './status-badge';

interface InquiryInfoProps {
  data: ItemDTO;
}

export function InquiryInfo({ data }: InquiryInfoProps) {
  return (
    <DetailGroup>
      <DetailField label="이름" value={data.name} />
      <DetailField label="이메일" value={data.email} />
      {data.phone && <DetailField label="연락처" value={data.phone} />}
      {data.company && <DetailField label="회사" value={data.company} />}
      {data.position && <DetailField label="직책" value={data.position} />}
      <DetailField
        label="접수일"
        value={
          <div className="flex items-center justify-between">
            <span>{format(data.created_at, 'yyyy-MM-dd HH:mm')}</span>
            <StatusBadge status={data.status} />
          </div>
        }
      />
      <DetailField
        label="문의 내용"
        value={<NewlineText>{data.content}</NewlineText>}
      />
    </DetailGroup>
  );
}
