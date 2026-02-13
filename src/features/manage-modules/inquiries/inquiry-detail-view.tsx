'use client';

import { useState } from 'react';
import { InquiryInfo } from './inquiry-info';
import { ReplyForm } from './reply-form';
import { ReplyList } from './reply-list';
import { type InquiryWithReplies, type ReplyRowData } from './config';

interface InquiryDetailViewProps {
  data: InquiryWithReplies;
}

export function InquiryDetailView({ data }: InquiryDetailViewProps) {
  const [replies, setReplies] = useState<ReplyRowData[]>(data.replies ?? []);

  const handleReplyCreated = (newReply: ReplyRowData) => {
    setReplies((prev) => [newReply, ...prev]);
  };

  return (
    <div className='space-y-6 pb-6'>
      <InquiryInfo data={data} />
      <ReplyForm inquiryId={data.id} onReplyCreated={handleReplyCreated} />
      <ReplyList replies={replies} />
    </div>
  );
}
